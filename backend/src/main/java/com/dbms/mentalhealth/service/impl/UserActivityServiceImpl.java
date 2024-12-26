package com.dbms.mentalhealth.service.impl;
import com.dbms.mentalhealth.dto.UserActivity.UserActivityDTO;
import com.dbms.mentalhealth.dto.UserActivity.UserRoleCountDTO;
import com.dbms.mentalhealth.dto.session.SessionSummaryDTO;
import com.dbms.mentalhealth.enums.Role;
import com.dbms.mentalhealth.mapper.UserActivityMapper;
import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.repository.UserRepository;
import com.dbms.mentalhealth.service.UserActivityService;
import com.github.benmanes.caffeine.cache.Cache;
import org.slf4j.Logger;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.TimeUnit;

@Service
public class UserActivityServiceImpl implements UserActivityService {

    private final CopyOnWriteArrayList<SseEmitter> allUserEmitters = new CopyOnWriteArrayList<>();
    private final CopyOnWriteArrayList<SseEmitter> roleEmitters = new CopyOnWriteArrayList<>();
    private final CopyOnWriteArrayList<SseEmitter> adminEmitters = new CopyOnWriteArrayList<>();
    private final CopyOnWriteArrayList<SseEmitter> listenerEmitters = new CopyOnWriteArrayList<>();
    private final CopyOnWriteArrayList<SseEmitter> userEmitters = new CopyOnWriteArrayList<>();
    private final CopyOnWriteArrayList<SseEmitter> sessionDetailsEmitters = new CopyOnWriteArrayList<>();

    Logger log = org.slf4j.LoggerFactory.getLogger(UserActivityServiceImpl.class);
    private final UserRepository userRepository;
    private final Cache<String, UserActivityDTO> userDetailsCache;
    private final Cache<String, List<UserActivityDTO>> roleBasedDetailsCache;
    private final Cache<String, LocalDateTime> lastSeenCache;

    public UserActivityServiceImpl(UserRepository userRepository,
                                   Cache<String, UserActivityDTO> userDetailsCache,
                                   Cache<String, List<UserActivityDTO>> roleBasedDetailsCache,
                                   Cache<String, LocalDateTime> lastSeenCache) {
        this.userRepository = userRepository;
        this.userDetailsCache = userDetailsCache;
        this.roleBasedDetailsCache = roleBasedDetailsCache;
        this.lastSeenCache = lastSeenCache;
        initializeCaches();
    }

    private void initializeCaches() {
        log.info("Initializing caches with active users");
        List<User> activeUsers = userRepository.findByIsActive(true);
        activeUsers.forEach(user -> {
            UserActivityDTO dto = UserActivityMapper.toUserActivityDTO(user);
            userDetailsCache.put(user.getEmail(), dto);
            roleBasedDetailsCache.asMap().computeIfAbsent(user.getRole().name(),
                    k -> new CopyOnWriteArrayList<>()).add(dto);
            lastSeenCache.put(user.getEmail(), user.getLastSeen());
        });
        log.info("Caches initialized successfully");
    }

    @Override
    public SseEmitter createEmitter() {
        log.debug("Creating new SseEmitter with 30 minutes timeout");
        return new SseEmitter(TimeUnit.MINUTES.toMillis(30));
    }

    @Override
    public void addAllUsersEmitter(SseEmitter emitter) {
        log.debug("Adding emitter to allUserEmitters list");
        addEmitterToList(emitter, allUserEmitters);
    }

    @Override
    public void addRoleCountEmitter(SseEmitter emitter) {
        log.debug("Adding emitter to roleEmitters list");
        addEmitterToList(emitter, roleEmitters);
    }

    @Override
    public void addAdminEmitter(SseEmitter emitter) {
        log.debug("Adding emitter to adminEmitters list");
        addEmitterToList(emitter, adminEmitters);
    }

    @Override
    public void addListenerEmitter(SseEmitter emitter) {
        log.debug("Adding emitter to listenerEmitters list");
        addEmitterToList(emitter, listenerEmitters);
    }

    @Override
    public void addUserEmitter(SseEmitter emitter) {
        log.debug("Adding emitter to userEmitters list");
        addEmitterToList(emitter, userEmitters);
    }

    @Override
    public void addSessionDetailsEmitter(SseEmitter emitter) {
        log.debug("Adding emitter to sessionDetailsEmitters list");
        addEmitterToList(emitter, sessionDetailsEmitters);
        sendInitialSessionDetails(emitter);
    }

    private void addEmitterToList(SseEmitter emitter, CopyOnWriteArrayList<SseEmitter> emitterList) {
        emitterList.add(emitter);
        emitter.onCompletion(() -> {
            log.debug("Emitter completed, removing from list");
            emitterList.remove(emitter);
        });
        emitter.onTimeout(() -> {
            log.debug("Emitter timed out, removing from list");
            emitterList.remove(emitter);
        });
        emitter.onError(e -> {
            log.error("Emitter encountered an error, removing from list", e);
            emitterList.remove(emitter);
        });
    }
    @Override
    public void sendInitialSessionDetails(SseEmitter emitter) {
        log.debug("Sending initial session details data");
        try {
            List<SessionSummaryDTO> cachedData = new ArrayList<>(); // Send empty list if no sessions are present
            emitter.send(SseEmitter.event().name("sessionDetails").data(cachedData));
        } catch (IOException e) {
            log.error("Error sending initial session details data", e);
            sessionDetailsEmitters.remove(emitter);
        }
    }
    private void sendInitialData(SseEmitter emitter, String mapKey, CopyOnWriteArrayList<SseEmitter> emitters) {
        try {
            logMapContents();
            List<UserActivityDTO> cachedData = roleBasedDetailsCache.getIfPresent(mapKey);
            if (cachedData == null) {
                log.debug("No cached data found for key: {}, fetching from source", mapKey);
                cachedData = fetchUserActivityDataForKey(mapKey);
                roleBasedDetailsCache.put(mapKey, cachedData);
            }
            emitter.send(SseEmitter.event().name(mapKey).data(cachedData));
        } catch (IOException e) {
            log.error("Error sending initial data for key: {}", mapKey, e);
            emitters.remove(emitter);
        }
    }

    private List<UserActivityDTO> fetchUserActivityDataForKey(String key) {
        switch (key) {
            case "allUsers":
                return getAllOnlineUsers();
            case "adminDetails":
                return getOnlineAdmins();
            case "listenerDetails":
                return getOnlineListeners();
            case "userDetails":
                return getOnlineUsers();
            default:
                throw new IllegalArgumentException("Unknown map key: " + key);
        }
    }

    private List<UserRoleCountDTO> fetchUserRoleCountDataForKey(String key) {
        if ("roleCounts".equals(key)) {
            return getOnlineUsersCountByRole();
        } else {
            throw new IllegalArgumentException("Unknown map key: " + key);
        }
    }

    @Override
    public void sendInitialAllUsers(SseEmitter emitter) {
        log.debug("Sending initial all users data");
        sendInitialData(emitter, "allUsers", allUserEmitters);
    }

    @Override
    public void sendInitialRoleCounts(SseEmitter emitter) {
        try {
            log.debug("Sending initial role counts data");
            List<UserRoleCountDTO> cachedData = fetchUserRoleCountDataForKey("roleCounts");
            emitter.send(SseEmitter.event().name("roleCounts").data(cachedData));
        } catch (IOException e) {
            log.error("Error sending initial role counts data", e);
            roleEmitters.remove(emitter);
        }
    }

    @Override
    public void sendInitialAdminDetails(SseEmitter emitter) {
        log.debug("Sending initial admin details data");
        sendInitialData(emitter, "adminDetails", adminEmitters);
    }

    @Override
    public void sendInitialListenerDetails(SseEmitter emitter) {
        log.debug("Sending initial listener details data");
        sendInitialData(emitter, "listenerDetails", listenerEmitters);
    }

    @Override
    public void sendInitialUserDetails(SseEmitter emitter) {
        log.debug("Sending initial user details data");
        sendInitialData(emitter, "userDetails", userEmitters);
    }

    private void logMapContents() {
        log.info("User Details Cache: {}", userDetailsCache.asMap());
        log.info("Role Based Details Cache: {}", roleBasedDetailsCache.asMap());
        log.info("Last Seen Cache: {}", lastSeenCache.asMap());
    }

    @Async
    @Override
    public void broadcastSessionDetails(SessionSummaryDTO sessionSummaryDTO) {
        log.debug("Broadcasting session details: {}", sessionSummaryDTO);
        for (SseEmitter emitter : sessionDetailsEmitters) {
            try {
                if ("ONGOING".equals(sessionSummaryDTO.getSessionStatus())) {
                    emitter.send(SseEmitter.event().name("sessionDetails").data(sessionSummaryDTO));
                } else {
                    emitter.send(SseEmitter.event().name("sessionDetails").data(new ArrayList<>()));
                    sessionDetailsEmitters.remove(emitter);
                }
            } catch (IOException e) {
                log.error("Error broadcasting session details", e);
                sessionDetailsEmitters.remove(emitter);
            }
        }
    }

    private <T> void broadcastData(String mapKey, List<T> data, CopyOnWriteArrayList<SseEmitter> emitterList) {
        logMapContents();
        if (data != null) {
            for (SseEmitter emitter : emitterList) {
                try {
                    emitter.send(SseEmitter.event().name(mapKey).data(data));
                } catch (IOException e) {
                    log.error("Error broadcasting data for key: {}", mapKey, e);
                    emitterList.remove(emitter);
                }
            }
        }
    }

    @Override
    @Async
    public void broadcastAllUsers() {
        log.debug("Broadcasting all users data");
        broadcastData("allUsers", getAllOnlineUsers(), allUserEmitters);
    }

    @Override
    @Async
    public void broadcastRoleCounts() {
        try {
            log.debug("Broadcasting role counts data");
            List<UserRoleCountDTO> cachedData = fetchUserRoleCountDataForKey("roleCounts");
            for (SseEmitter emitter : roleEmitters) {
                try {
                    emitter.send(SseEmitter.event().name("roleCounts").data(cachedData));
                    log.info("User Details Cache: {}", cachedData);
                } catch (IOException e) {
                    log.error("Error broadcasting role counts data", e);
                    roleEmitters.remove(emitter);
                }
            }
        } catch (Exception e) {
            log.error("Error broadcasting role counts", e);
        }
    }

    @Override
    @Async
    public void broadcastAdminDetails() {
        log.debug("Broadcasting admin details data");
        broadcastData("adminDetails", getOnlineAdmins(), adminEmitters);
    }

    @Override
    @Async
    public void broadcastListenerDetails() {
        log.debug("Broadcasting listener details data");
        broadcastData("listenerDetails", getOnlineListeners(), listenerEmitters);
    }

    @Override
    @Async
    public void broadcastUserDetails() {
        log.debug("Broadcasting user details data");
        broadcastData("userDetails", getOnlineUsers(), userEmitters);
    }

    @Override
    public List<UserActivityDTO> getAllOnlineUsers() {
        log.debug("Fetching all online users");
        return new ArrayList<>(userDetailsCache.asMap().values());
    }

    @Override
    public List<UserRoleCountDTO> getOnlineUsersCountByRole() {
        log.debug("Fetching online users count by role");
        List<UserRoleCountDTO> userRoleCounts = new ArrayList<>();
        userRoleCounts.add(new UserRoleCountDTO(Role.ADMIN.name(), getOnlineAdmins().size()));
        userRoleCounts.add(new UserRoleCountDTO(Role.LISTENER.name(), getOnlineListeners().size()));
        userRoleCounts.add(new UserRoleCountDTO(Role.USER.name(), getOnlineUsers().size()));
        return userRoleCounts;
    }

    @Override
    public List<UserActivityDTO> getOnlineAdmins() {
        log.debug("Fetching online admins");
        return roleBasedDetailsCache.getIfPresent(Role.ADMIN.name()) != null ?
                roleBasedDetailsCache.getIfPresent(Role.ADMIN.name()) : new ArrayList<>();
    }

    @Override
    public List<UserActivityDTO> getOnlineListeners() {
        log.debug("Fetching online listeners");
        return roleBasedDetailsCache.getIfPresent(Role.LISTENER.name()) != null ?
                roleBasedDetailsCache.getIfPresent(Role.LISTENER.name()) : new ArrayList<>();
    }

    @Override
    public List<UserActivityDTO> getOnlineUsers() {
        log.debug("Fetching online users");
        return roleBasedDetailsCache.getIfPresent(Role.USER.name()) != null ?
                roleBasedDetailsCache.getIfPresent(Role.USER.name()) : new ArrayList<>();
    }

    @Override
    @Async
    public void updateLastSeen(String email) {
        log.debug("Updating last seen for user: {}", email);
        User user = userRepository.findByEmail(email);
        user.setIsActive(true);
        user.setLastSeen(LocalDateTime.now());
        userRepository.save(user);
        lastSeenCache.put(email, user.getLastSeen());
        UserActivityDTO dto = UserActivityMapper.toUserActivityDTO(user);

        // Remove stale cache data first
        userDetailsCache.invalidate(email);
        roleBasedDetailsCache.asMap().values().forEach(list ->
                list.removeIf(existingUser -> existingUser.getUserId().equals(dto.getUserId())));

        // Update cache
        userDetailsCache.put(email, dto);
        roleBasedDetailsCache.asMap().computeIfAbsent(user.getRole().name(),
                k -> new CopyOnWriteArrayList<>()).add(dto);

        // Broadcast updated data
        broadcastAllUsers();
        broadcastRoleCounts();
        broadcastAdminDetails();
        broadcastListenerDetails();
        broadcastUserDetails();
    }

    @Override
    public List<String> findExpiredUsers() {
        log.debug("Finding expired users");
        LocalDateTime now = LocalDateTime.now();
        return lastSeenCache.asMap().entrySet().stream()
                .filter(entry -> {
                    LocalDateTime lastSeen = entry.getValue();
                    return lastSeen != null &&
                            lastSeen.isBefore(now.minusMinutes(5));
                })
                .map(Map.Entry::getKey)
                .toList();
    }

    @Override
    @Async
    public void markUserInactive(String email) {
        log.debug("Marking user as inactive: {}", email);
        User user = userRepository.findByEmail(email);
        if (user != null && user.getIsActive()) {
            user.setIsActive(false);
            userRepository.save(user);

            lastSeenCache.invalidate(email);
            userDetailsCache.invalidate(email);
            roleBasedDetailsCache.asMap().values().forEach(list -> {
                list.removeIf(dto -> dto.getUserId().equals(user.getUserId()));
            });

            log.info("User marked as inactive: {}", email);

            // Broadcast updates
            broadcastAllUsers();
            broadcastRoleCounts();
            broadcastAdminDetails();
            broadcastListenerDetails();
            broadcastUserDetails();
        }
    }
}