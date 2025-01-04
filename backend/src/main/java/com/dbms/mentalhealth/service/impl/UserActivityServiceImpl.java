package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.UserActivity.UserActivityDTO;
import com.dbms.mentalhealth.dto.UserActivity.UserRoleCountDTO;
import com.dbms.mentalhealth.dto.session.response.SessionSummaryDTO;
import com.dbms.mentalhealth.enums.CacheKey;
import com.dbms.mentalhealth.enums.Role;
import com.dbms.mentalhealth.mapper.UserActivityMapper;
import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.repository.UserRepository;
import com.dbms.mentalhealth.service.SessionService;
import com.dbms.mentalhealth.service.UserActivityService;
import com.github.benmanes.caffeine.cache.Cache;
import org.apache.catalina.connector.ClientAbortException;
import org.slf4j.Logger;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class UserActivityServiceImpl implements UserActivityService {
    private final CopyOnWriteArrayList<SseEmitter> allUserEmitters = new CopyOnWriteArrayList<>();
    private final CopyOnWriteArrayList<SseEmitter> roleEmitters = new CopyOnWriteArrayList<>();
    private final CopyOnWriteArrayList<SseEmitter> adminEmitters = new CopyOnWriteArrayList<>();
    private final CopyOnWriteArrayList<SseEmitter> listenerEmitters = new CopyOnWriteArrayList<>();
    private final CopyOnWriteArrayList<SseEmitter> userEmitters = new CopyOnWriteArrayList<>();
    private final CopyOnWriteArrayList<SseEmitter> sessionDetailsEmitters = new CopyOnWriteArrayList<>();
    private final SessionService sessionService;
    Logger log = org.slf4j.LoggerFactory.getLogger(UserActivityServiceImpl.class);
    private final UserRepository userRepository;
    private final Cache<String, UserActivityDTO> userDetailsCache;
    private final Cache<String, List<UserActivityDTO>> roleBasedDetailsCache;
    private final Cache<String, LocalDateTime> lastSeenCache;
    private static final long BROADCAST_THROTTLE_MS = 1000;
    private LocalDateTime lastBroadcast = LocalDateTime.now();

    public UserActivityServiceImpl(UserRepository userRepository,
                                   Cache<String, UserActivityDTO> userDetailsCache,
                                   Cache<String, List<UserActivityDTO>> roleBasedDetailsCache,
                                   Cache<String, LocalDateTime> lastSeenCache,
                                   SessionService sessionService) {
        this.userRepository = userRepository;
        this.userDetailsCache = userDetailsCache;
        this.roleBasedDetailsCache = roleBasedDetailsCache;
        this.lastSeenCache = lastSeenCache;
        this.sessionService = sessionService;
        initializeCaches();
    }

    private synchronized void initializeCaches() {
        log.info("Initializing caches with active users");
        try {
            List<User> activeUsers = userRepository.findByIsActive(true);

            userDetailsCache.invalidateAll();
            roleBasedDetailsCache.invalidateAll();
            lastSeenCache.invalidateAll();

            activeUsers.forEach(user -> {
                try {
                    UserActivityDTO dto = UserActivityMapper.toUserActivityDTO(user);
                    String email = user.getEmail();
                    CacheKey cacheKey = CacheKey.fromRole(user.getRole());

                    userDetailsCache.put(email, dto);
                    roleBasedDetailsCache.asMap()
                            .computeIfAbsent(cacheKey.getCacheKey(), k -> new CopyOnWriteArrayList<>())
                            .add(dto);
                    lastSeenCache.put(email, user.getLastSeen());

                    log.debug("Initialized caches for user: {} with cache key: {}", email, cacheKey);
                } catch (Exception e) {
                    log.error("Error initializing caches for user: {}", user.getEmail(), e);
                }
            });

            logCacheStats();
        } catch (Exception e) {
            log.error("Failed to initialize caches", e);
            throw new RuntimeException("Cache initialization failed", e);
        }
    }

    @Override
    public SseEmitter createEmitter() {
        return new SseEmitter(TimeUnit.MINUTES.toMillis(30));
    }

    private void addEmitterToList(SseEmitter emitter, CopyOnWriteArrayList<SseEmitter> emitterList) {
        emitterList.add(emitter);
        emitter.onCompletion(() -> emitterList.remove(emitter));
        emitter.onTimeout(() -> emitterList.remove(emitter));
        emitter.onError(e -> emitterList.remove(emitter));
    }


    @Override
    public void addAllUsersEmitter(SseEmitter emitter) {
        emitter.onTimeout(() -> removeEmitterSafely(emitter, allUserEmitters));
        emitter.onCompletion(() -> removeEmitterSafely(emitter, allUserEmitters));
        emitter.onError(e -> removeEmitterSafely(emitter, allUserEmitters));
        allUserEmitters.add(emitter);
    }


    @Override
    public void addRoleCountEmitter(SseEmitter emitter) {
        addEmitterToList(emitter, roleEmitters);
    }

    @Override
    public void addAdminEmitter(SseEmitter emitter) {
        addEmitterToList(emitter, adminEmitters);
    }

    @Override
    public void addListenerEmitter(SseEmitter emitter) {
        addEmitterToList(emitter, listenerEmitters);
    }

    @Override
    public void addUserEmitter(SseEmitter emitter) {
        addEmitterToList(emitter, userEmitters);
    }

    @Override
    public void addSessionDetailsEmitter(SseEmitter emitter) {
        addEmitterToList(emitter, sessionDetailsEmitters);
        sendInitialSessionDetails(emitter);
    }

    @Override
    public void sendInitialSessionDetails(SseEmitter emitter) {
        try {
            List<SessionSummaryDTO> cachedData = sessionService.broadcastFullSessionCache();
            if (cachedData == null) {
                cachedData = new ArrayList<>();
            }
            emitter.send(SseEmitter.event().name("sessionDetails").data(cachedData));
        } catch (IOException e) {
            log.error("Error sending initial session details", e);
            sessionDetailsEmitters.remove(emitter);
        }
    }

    private List<UserActivityDTO> updateSessionStatus(List<UserActivityDTO> users) {
        return users.stream()
                .map(UserActivityMapper::toUserActivityDTO)
                .collect(Collectors.toList());
    }

    private void sendInitialData(SseEmitter emitter, CacheKey cacheKey, CopyOnWriteArrayList<SseEmitter> emitters) {
        try {
            logMapContents();
            List<UserActivityDTO> cachedData;

            if (cacheKey == CacheKey.ALL_USERS) {
                cachedData = getAllOnlineUsers();
            } else {
                cachedData = roleBasedDetailsCache.getIfPresent(cacheKey.getCacheKey());
                if (cachedData == null) {
                    cachedData = fetchUserActivityDataForKey(cacheKey);
                    roleBasedDetailsCache.put(cacheKey.getCacheKey(), updateSessionStatus(cachedData));
                }
            }

            emitter.send(SseEmitter.event()
                    .name(cacheKey.getEventName())
                    .data(updateSessionStatus(cachedData)));
        } catch (IOException e) {
            log.error("Error sending initial data for key: {}", cacheKey, e);
            emitters.remove(emitter);
        }
    }

    private List<UserActivityDTO> fetchUserActivityDataForKey(CacheKey cacheKey) {
        return switch (cacheKey) {
            case ALL_USERS -> getAllOnlineUsers();
            case ADMIN_DETAILS -> getOnlineAdmins();
            case LISTENER_DETAILS -> getOnlineListeners();
            case USER_DETAILS -> getOnlineUsers();
        };
    }
    @Override
    public void sendInitialRoleCounts(SseEmitter emitter) {
        try {
            List<UserRoleCountDTO> cachedData = getOnlineUsersCountByRole();
            emitter.send(SseEmitter.event().name("roleCounts").data(cachedData));
        } catch (IOException e) {
            log.error("Error sending initial role counts", e);
            roleEmitters.remove(emitter);
        }
    }

    @Override
    public void sendInitialAllUsers(SseEmitter emitter) {
        sendInitialData(emitter, CacheKey.ALL_USERS, allUserEmitters);
    }

    @Override
    public void sendInitialAdminDetails(SseEmitter emitter) {
        sendInitialData(emitter, CacheKey.ADMIN_DETAILS, adminEmitters);
    }

    @Override
    public void sendInitialListenerDetails(SseEmitter emitter) {
        sendInitialData(emitter, CacheKey.LISTENER_DETAILS, listenerEmitters);
    }

    @Override
    public void sendInitialUserDetails(SseEmitter emitter) {
        sendInitialData(emitter, CacheKey.USER_DETAILS, userEmitters);
    }

    private void logMapContents() {
        log.info("Cache contents - User Details: {}, Role Based: {}, Last Seen: {}",
                userDetailsCache.asMap(), roleBasedDetailsCache.asMap(), lastSeenCache.asMap());
    }

    @Override
    public void broadcastSessionDetails(List<SessionSummaryDTO> sessionSummaryDTOs) {
        if (sessionDetailsEmitters.isEmpty()) {
            return; // Skip if no active listeners
        }

        List<SseEmitter> deadEmitters = new ArrayList<>();

        sessionDetailsEmitters.forEach(emitter -> {
            try {
                if (emitter != null) {
                    emitter.send(SseEmitter.event()
                            .name("sessionDetails")
                            .data(sessionSummaryDTOs));
                }
            } catch (Exception e) {
                if (e instanceof ClientAbortException ||
                        (e.getMessage() != null && e.getMessage().contains("Broken pipe"))) {
                    log.debug("Client disconnected from session details: {}", e.getMessage());
                } else {
                    log.warn("Error broadcasting session details: {}", e.getMessage());
                }
                deadEmitters.add(emitter);
            }
        });

        // Clean up dead emitters
        if (!deadEmitters.isEmpty()) {
            sessionDetailsEmitters.removeAll(deadEmitters);
            deadEmitters.forEach(emitter -> {
                try {
                    emitter.complete();
                } catch (Exception e) {
                    log.debug("Error while completing session emitter: {}", e.getMessage());
                }
            });
        }

        // Continue with other broadcasts
        updateAllCaches();
        broadcastAllUsers();
        broadcastAdminDetails();
        broadcastListenerDetails();
        broadcastUserDetails();
    }

    private void updateAllCaches() {
        userDetailsCache.asMap().forEach((email, dto) -> {
            UserActivityDTO updatedDto = UserActivityMapper.toUserActivityDTO(dto);
            userDetailsCache.put(email, updatedDto);
        });

        roleBasedDetailsCache.asMap().forEach((role, dtos) -> {
            List<UserActivityDTO> updatedDtos = dtos.stream()
                    .map(UserActivityMapper::toUserActivityDTO)
                    .collect(Collectors.toList());
            roleBasedDetailsCache.put(role, updatedDtos);
        });
    }
    private void removeEmitterSafely(SseEmitter emitter, CopyOnWriteArrayList<SseEmitter> emitterList) {
        try {
            emitterList.remove(emitter);
            emitter.complete();
        } catch (Exception e) {
            log.debug("Error while removing emitter: {}", e.getMessage());
        }
    }

    private <T> void broadcastData(CacheKey cacheKey, CopyOnWriteArrayList<SseEmitter> emitterList) {
        if (emitterList.isEmpty()) {
            return; // Skip broadcasting if there are no active emitters
        }

        List<UserActivityDTO> data = fetchUserActivityDataForKey(cacheKey);
        List<UserActivityDTO> updatedData = data.stream()
                .map(UserActivityMapper::toUserActivityDTO)
                .collect(Collectors.toList());

        List<SseEmitter> deadEmitters = new ArrayList<>();

        emitterList.forEach(emitter -> {
            try {
                if (emitter != null) {
                    emitter.send(SseEmitter.event()
                            .name(cacheKey.getEventName())
                            .data(updatedData));
                }
            } catch (ClientAbortException e) {
                log.debug("Client disconnected gracefully: {}", e.getMessage());
                deadEmitters.add(emitter);
            } catch (IOException e) {
                if (e.getMessage() != null &&
                        (e.getMessage().contains("Broken pipe") ||
                                e.getMessage().contains("Connection reset by peer"))) {
                    log.debug("Client connection closed: {}", e.getMessage());
                } else {
                    log.warn("Error broadcasting data for key {}: {}", cacheKey, e.getMessage());
                }
                deadEmitters.add(emitter);
            } catch (Exception e) {
                log.warn("Unexpected error while broadcasting: {}", e.getMessage());
                deadEmitters.add(emitter);
            }
        });

        // Clean up dead emitters outside the loop
        if (!deadEmitters.isEmpty()) {
            emitterList.removeAll(deadEmitters);
            deadEmitters.forEach(emitter -> {
                try {
                    emitter.complete();
                } catch (Exception e) {
                    log.debug("Error while completing emitter: {}", e.getMessage());
                }
            });
        }
    }

    @Override
    @Async
    public void broadcastAllUsers() {
        broadcastData(CacheKey.ALL_USERS, allUserEmitters);
        broadcastFullCacheDetails();
    }

    @Override
    @Async
    public void broadcastAdminDetails() {
        broadcastData(CacheKey.ADMIN_DETAILS, adminEmitters);
        broadcastFullCacheDetails();
    }

    @Override
    @Async
    public void broadcastListenerDetails() {
        broadcastData(CacheKey.LISTENER_DETAILS, listenerEmitters);
        broadcastFullCacheDetails();
    }

    @Override
    @Async
    public void broadcastUserDetails() {
        broadcastData(CacheKey.USER_DETAILS, userEmitters);
        broadcastFullCacheDetails();
    }

    @Override
    public void broadcastRoleCounts() {
        if (roleEmitters.isEmpty()) {
            return;
        }

        List<UserRoleCountDTO> roleCounts = getOnlineUsersCountByRole();
        List<SseEmitter> deadEmitters = new ArrayList<>();

        roleEmitters.forEach(emitter -> {
            try {
                if (emitter != null) {
                    emitter.send(SseEmitter.event()
                            .name("roleCounts")
                            .data(roleCounts));
                }
            } catch (Exception e) {
                if (e instanceof ClientAbortException ||
                        (e.getMessage() != null && e.getMessage().contains("Broken pipe"))) {
                    log.debug("Client disconnected from role counts: {}", e.getMessage());
                } else {
                    log.warn("Error broadcasting role counts: {}", e.getMessage());
                }
                deadEmitters.add(emitter);
            }
        });

        // Clean up dead emitters
        if (!deadEmitters.isEmpty()) {
            roleEmitters.removeAll(deadEmitters);
            deadEmitters.forEach(emitter -> {
                try {
                    emitter.complete();
                } catch (Exception e) {
                    log.debug("Error while completing role emitter: {}", e.getMessage());
                }
            });
        }

        broadcastFullCacheDetails();
    }

    private void broadcastFullCacheDetails() {
        logMapContents();
        allUserEmitters.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event().name("fullCacheDetails")
                        .data(Map.of(
                                "userDetails", userDetailsCache.asMap(),
                                "roleBasedDetails", roleBasedDetailsCache.asMap(),
                                "lastSeen", lastSeenCache.asMap()
                        )));
            } catch (IOException e) {
                log.error("Error broadcasting cache details", e);
                allUserEmitters.remove(emitter);
            }
        });
    }

    @Override
    public List<UserActivityDTO> getAllOnlineUsers() {
        return updateSessionStatus(new ArrayList<>(userDetailsCache.asMap().values()));
    }

    @Override
    public List<UserRoleCountDTO> getOnlineUsersCountByRole() {
        return Arrays.asList(
                new UserRoleCountDTO(Role.ADMIN.name(), getOnlineAdmins().size()),
                new UserRoleCountDTO(Role.LISTENER.name(), getOnlineListeners().size()),
                new UserRoleCountDTO(Role.USER.name(), getOnlineUsers().size())
        );
    }

    @Override
    public List<UserActivityDTO> getOnlineAdmins() {
        List<UserActivityDTO> admins = roleBasedDetailsCache.getIfPresent(Role.ADMIN.name());
        return admins != null ? updateSessionStatus(admins) : new ArrayList<>();
    }

    @Override
    public List<UserActivityDTO> getOnlineListeners() {
        List<UserActivityDTO> listeners = roleBasedDetailsCache.getIfPresent(Role.LISTENER.name());
        return listeners != null ? updateSessionStatus(listeners) : new ArrayList<>();
    }

    @Override
    public List<UserActivityDTO> getOnlineUsers() {
        List<UserActivityDTO> users = roleBasedDetailsCache.getIfPresent(Role.USER.name());
        return users != null ? updateSessionStatus(users) : new ArrayList<>();
    }



    @Override
    @Async
    public void updateLastSeenStatus(String email) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            user.setIsActive(true);
            user.setLastSeen(LocalDateTime.now());
            userRepository.save(user);
            lastSeenCache.put(email, user.getLastSeen());

            UserActivityDTO dto = UserActivityMapper.toUserActivityDTO(user);
            updateCaches(email, dto, Role.valueOf(user.getRole().name()));

            // Throttle broadcasts
            if (Duration.between(lastBroadcast, LocalDateTime.now()).toMillis() > BROADCAST_THROTTLE_MS) {
                broadcastUpdates();
                lastBroadcast = LocalDateTime.now();
            }
        }
    }


    @Async
    @Override
    public void updateLastSeen(String email) {
        LocalDateTime now = LocalDateTime.now();
        lastSeenCache.put(email, now);

        UserActivityDTO dto = userDetailsCache.getIfPresent(email);
        if (dto != null) {
            userDetailsCache.put(email, dto);
        }
    }

    @Override
    @Async
    public void markUserInactive(String email) {
        User user = userRepository.findByEmail(email);
        if (user != null && user.getIsActive()) {
            user.setIsActive(false);
            userRepository.save(user);
            lastSeenCache.invalidate(email);
            userDetailsCache.invalidate(email);
            roleBasedDetailsCache.asMap().values().forEach(list ->
                    list.removeIf(dto -> dto.getUserId().equals(user.getUserId())));
            broadcastUpdates();
        }
    }
    @Override
    public void broadcastUpdates() {
        CompletableFuture.runAsync(() -> {
            broadcastAllUsers();
            broadcastRoleCounts();
            broadcastAdminDetails();
            broadcastListenerDetails();
            broadcastUserDetails();
        });
    }
    private synchronized void updateCaches(String email, UserActivityDTO dto, Role role) {
        try {
            synchronized (this) {
                userDetailsCache.put(email, dto);

                CacheKey cacheKey = CacheKey.fromRole(role);
                List<UserActivityDTO> roleUsers = roleBasedDetailsCache.getIfPresent(cacheKey.getCacheKey());
                if (roleUsers == null) {
                    roleUsers = new CopyOnWriteArrayList<>();
                    roleBasedDetailsCache.put(cacheKey.getCacheKey(), roleUsers);
                }

                roleUsers.removeIf(existing -> existing.getUserId().equals(dto.getUserId()));
                roleUsers.add(dto);

                lastSeenCache.put(email, LocalDateTime.now());

                log.debug("Updated all caches for user: {} with cache key: {}", email, cacheKey);
            }
        } catch (Exception e) {
            log.error("Failed to update caches for user: {}", email, e);
            initializeCaches();
        }
    }


    public void logCacheStats() {
        log.info("Cache stats - User Details: {}, Role Based: {}, Last Seen: {}",
                userDetailsCache.stats(), roleBasedDetailsCache.stats(), lastSeenCache.stats());
        log.info("Cache contents - User Details: {}, Role Based: {}, Last Seen: {}",
                userDetailsCache.asMap(), roleBasedDetailsCache.asMap(), lastSeenCache.asMap());
    }
}