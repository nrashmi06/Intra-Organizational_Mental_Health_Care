package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.UserActivity.UserActivityDTO;
import com.dbms.mentalhealth.dto.UserActivity.UserRoleCountDTO;
import com.dbms.mentalhealth.dto.session.SessionSummaryDTO;
import com.dbms.mentalhealth.enums.Role;
import com.dbms.mentalhealth.mapper.UserActivityMapper;
import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.repository.UserRepository;
import com.dbms.mentalhealth.service.SessionService;
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

    private void initializeCaches() {
        log.info("Initializing caches with active users");
        List<User> activeUsers = userRepository.findByIsActive(true);
        activeUsers.forEach(user -> {
            boolean isInASession = sessionService.isUserInSession(user.getUserId());
            UserActivityDTO dto = new UserActivityDTO(user.getUserId(), user.getAnonymousName(), isInASession);
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

    @Override
    public void sendInitialSessionDetails(SseEmitter emitter) {
        log.debug("Sending initial session details data");
        try {
            List<SessionSummaryDTO> cachedData = sessionService.broadcastFullSessionCache();
            if (cachedData == null) {
                log.debug("No cached session data found, sending empty list");
                cachedData = new ArrayList<>();
            }
            log.info("Initial session details data: {}", cachedData);
            emitter.send(SseEmitter.event().name("sessionDetails").data(cachedData));
        } catch (IOException e) {
            log.error("Error sending initial session details data", e);
            sessionDetailsEmitters.remove(emitter);
        }
    }

    private List<UserActivityDTO> updateSessionStatus(List<UserActivityDTO> users) {
        return users.stream()
                .map(user -> {
                    user.setInASession(sessionService.isUserInSession(user.getUserId()));
                    return user;
                })
                .toList();
    }

    private void sendInitialData(SseEmitter emitter, String mapKey, CopyOnWriteArrayList<SseEmitter> emitters) {
        try {
            logMapContents();
            List<UserActivityDTO> cachedData = roleBasedDetailsCache.getIfPresent(mapKey);
            if (cachedData == null) {
                log.debug("No cached data found for key: {}, fetching from source", mapKey);
                cachedData = fetchUserActivityDataForKey(mapKey);
                roleBasedDetailsCache.put(mapKey, updateSessionStatus(cachedData));
            }
            emitter.send(SseEmitter.event().name(mapKey).data(updateSessionStatus(cachedData)));
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

    @Override
    public void sendInitialAllUsers(SseEmitter emitter) {
        log.debug("Sending initial all users data");
        sendInitialData(emitter, "allUsers", allUserEmitters);
    }

    @Override
    public void sendInitialRoleCounts(SseEmitter emitter) {
        try {
            log.debug("Sending initial role counts data");
            List<UserRoleCountDTO> cachedData = getOnlineUsersCountByRole();
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
    public void broadcastSessionDetails(List<SessionSummaryDTO> sessionSummaryDTOs) {
        log.debug("Broadcasting session details: {}", sessionSummaryDTOs);
        for (SseEmitter emitter : sessionDetailsEmitters) {
            try {
                emitter.send(SseEmitter.event().name("sessionDetails").data(sessionSummaryDTOs));
            } catch (IOException e) {
                log.error("Error broadcasting session details", e);
                sessionDetailsEmitters.remove(emitter);
            }
        }
        // Call other broadcasting methods
        broadcastAllUsers();
        broadcastAdminDetails();
        broadcastListenerDetails();
        broadcastUserDetails();
    }

    private <T> void broadcastData(String mapKey, List<T> data, CopyOnWriteArrayList<SseEmitter> emitterList) {
        if (data != null && data instanceof List<?>) {
            List<?> dataList = (List<?>) data;
            for (Object item : dataList) {
                if (item instanceof UserActivityDTO) {
                    UserActivityDTO dto = (UserActivityDTO) item;
                    dto.setInASession(sessionService.isUserInSession(dto.getUserId()));
                }
            }
        }

        for (SseEmitter emitter : emitterList) {
            try {
                emitter.send(SseEmitter.event().name(mapKey).data(data));
            } catch (IOException e) {
                log.error("Error broadcasting data for key: {}", mapKey, e);
                emitterList.remove(emitter);
            }
        }
    }

    @Override
    @Async
    public void broadcastAllUsers() {
        log.debug("Broadcasting all users data");
        broadcastData("allUsers", getAllOnlineUsers(), allUserEmitters);
        broadcastFullCacheDetails();
    }

    @Override
    @Async
    public void broadcastRoleCounts() {
        try {
            log.debug("Broadcasting role counts data");
            List<UserRoleCountDTO> roleCounts = getOnlineUsersCountByRole();
            for (SseEmitter emitter : roleEmitters) {
                try {
                    emitter.send(SseEmitter.event().name("roleCounts").data(roleCounts));
                } catch (IOException e) {
                    log.error("Error broadcasting role counts data", e);
                    roleEmitters.remove(emitter);
                }
            }
            broadcastFullCacheDetails();
        } catch (Exception e) {
            log.error("Error broadcasting role counts", e);
        }
    }

    @Override
    @Async
    public void broadcastAdminDetails() {
        log.debug("Broadcasting admin details data");
        broadcastData("adminDetails", getOnlineAdmins(), adminEmitters);
        broadcastFullCacheDetails();
    }

    @Override
    @Async
    public void broadcastListenerDetails() {
        log.debug("Broadcasting listener details data");
        broadcastData("listenerDetails", getOnlineListeners(), listenerEmitters);
        broadcastFullCacheDetails();
    }

    @Override
    @Async
    public void broadcastUserDetails() {
        log.debug("Broadcasting user details data");
        broadcastData("userDetails", getOnlineUsers(), userEmitters);
        broadcastFullCacheDetails();
    }

    private void broadcastFullCacheDetails() {
        logMapContents();
        for (SseEmitter emitter : allUserEmitters) {
            try {
                emitter.send(SseEmitter.event().name("fullCacheDetails").data(userDetailsCache.asMap()));
                emitter.send(SseEmitter.event().name("fullCacheDetails").data(roleBasedDetailsCache.asMap()));
                emitter.send(SseEmitter.event().name("fullCacheDetails").data(lastSeenCache.asMap()));
            } catch (IOException e) {
                log.error("Error broadcasting full cache details", e);
                allUserEmitters.remove(emitter);
            }
        }
    }

    @Override
    public List<UserActivityDTO> getAllOnlineUsers() {
        List<UserActivityDTO> users = new ArrayList<>(userDetailsCache.asMap().values());
        return updateSessionStatus(users);
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
    public void updateLastSeen(String email) {
        log.debug("Updating last seen for user: {}", email);
        User user = userRepository.findByEmail(email);
        user.setIsActive(true);
        user.setLastSeen(LocalDateTime.now());
        userRepository.save(user);
        lastSeenCache.put(email, user.getLastSeen());

        UserActivityDTO dto = UserActivityMapper.toUserActivityDTO(user);
        dto.setInASession(sessionService.isUserInSession(dto.getUserId()));

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