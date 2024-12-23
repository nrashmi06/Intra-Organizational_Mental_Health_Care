package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.UserActivity.UserActivityDTO;
import com.dbms.mentalhealth.dto.UserActivity.UserRoleCountDTO;
import com.dbms.mentalhealth.enums.Role;
import com.dbms.mentalhealth.mapper.UserActivityMapper;
import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.repository.UserRepository;
import com.dbms.mentalhealth.service.UserActivityService;
import com.github.benmanes.caffeine.cache.Cache;
import org.slf4j.Logger;
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
    Logger log = org.slf4j.LoggerFactory.getLogger(UserActivityServiceImpl.class);
    private final UserRepository userRepository;

    private final Cache<String, UserActivityDTO> userDetailsCache;
    private final Cache<String, List<UserActivityDTO>> roleBasedDetailsCache;
    private final Cache<String, LocalDateTime> lastSeenCache;

    public UserActivityServiceImpl(UserRepository userRepository, Cache<String, UserActivityDTO> userDetailsCache,
                                   Cache<String, List<UserActivityDTO>> roleBasedDetailsCache, Cache<String, LocalDateTime> lastSeenCache) {
        this.userRepository = userRepository;
        this.userDetailsCache = userDetailsCache;
        this.roleBasedDetailsCache = roleBasedDetailsCache;
        this.lastSeenCache = lastSeenCache;
        initializeCaches();
    }

    private void initializeCaches() {
        List<User> activeUsers = userRepository.findByIsActive(true);
        activeUsers.forEach(user -> {
            UserActivityDTO dto = UserActivityMapper.toUserActivityDTO(user);
            userDetailsCache.put(user.getEmail(), dto);
            roleBasedDetailsCache.asMap().computeIfAbsent(user.getRole().name(), k -> new CopyOnWriteArrayList<>()).add(dto);
            lastSeenCache.put(user.getEmail(), user.getLastSeen());
        });
    }

    @Override
    public SseEmitter createEmitter() {
        return new SseEmitter(TimeUnit.MINUTES.toMillis(30));
    }

    @Override
    public void addAllUsersEmitter(SseEmitter emitter) {
        addEmitterToList(emitter, allUserEmitters);
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

    private void addEmitterToList(SseEmitter emitter, CopyOnWriteArrayList<SseEmitter> emitterList) {
        emitterList.add(emitter);
        emitter.onCompletion(() -> emitterList.remove(emitter));
        emitter.onTimeout(() -> emitterList.remove(emitter));
        emitter.onError(e -> emitterList.remove(emitter));
    }

    private void sendInitialData(SseEmitter emitter, String cacheKey, CopyOnWriteArrayList<SseEmitter> emitters) {
        try {
            logCacheContents();
            List<UserActivityDTO> cachedData = roleBasedDetailsCache.getIfPresent(cacheKey);
            if (cachedData == null) {
                cachedData = fetchUserActivityDataForKey(cacheKey);
                roleBasedDetailsCache.put(cacheKey, cachedData);
            }
            emitter.send(SseEmitter.event().name(cacheKey).data(cachedData));
        } catch (IOException e) {
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
                throw new IllegalArgumentException("Unknown cache key: " + key);
        }
    }

    private List<UserRoleCountDTO> fetchUserRoleCountDataForKey(String key) {
        if ("roleCounts".equals(key)) {
            return getOnlineUsersCountByRole();
        } else {
            throw new IllegalArgumentException("Unknown cache key: " + key);
        }
    }

    @Override
    public void sendInitialAllUsers(SseEmitter emitter) {
        sendInitialData(emitter, "allUsers", allUserEmitters);
    }

    @Override
    public void sendInitialRoleCounts(SseEmitter emitter) {
        try {
            List<UserRoleCountDTO> cachedData = fetchUserRoleCountDataForKey("roleCounts");
            emitter.send(SseEmitter.event().name("roleCounts").data(cachedData));
        } catch (IOException e) {
            roleEmitters.remove(emitter);
        }
    }

    @Override
    public void sendInitialAdminDetails(SseEmitter emitter) {
        sendInitialData(emitter, "adminDetails", adminEmitters);
    }

    @Override
    public void sendInitialListenerDetails(SseEmitter emitter) {
        sendInitialData(emitter, "listenerDetails", listenerEmitters);
    }

    @Override
    public void sendInitialUserDetails(SseEmitter emitter) {
        sendInitialData(emitter, "userDetails", userEmitters);
    }

    private void logCacheContents() {
        log.info("User Details Cache: {}", userDetailsCache.asMap());
        log.info("Role Based Details Cache: {}", roleBasedDetailsCache.asMap());
        log.info("Last Seen Cache: {}", lastSeenCache.asMap());
    }

    private <T> void broadcastData(String cacheKey, List<T> data, CopyOnWriteArrayList<SseEmitter> emitterList) {
        logCacheContents();
        if (data != null) {
            for (SseEmitter emitter : emitterList) {
                try {
                    emitter.send(SseEmitter.event().name(cacheKey).data(data));
                } catch (IOException e) {
                    emitterList.remove(emitter);
                }
            }
        }
    }

    @Override
    public void broadcastAllUsers() {
        broadcastData("allUsers", getAllOnlineUsers(), allUserEmitters);
    }

    @Override
    public void broadcastRoleCounts() {
        try {
            List<UserRoleCountDTO> cachedData = fetchUserRoleCountDataForKey("roleCounts");
            for (SseEmitter emitter : roleEmitters) {
                try {
                    emitter.send(SseEmitter.event().name("roleCounts").data(cachedData));
                    log.info("User Details Cache: {}", cachedData);
                } catch (IOException e) {
                    roleEmitters.remove(emitter);
                }
            }
        } catch (Exception e) {
            log.error("Error broadcasting role counts", e);
        }
    }

    @Override
    public void broadcastAdminDetails() {
        broadcastData("adminDetails", getOnlineAdmins(), adminEmitters);
    }

    @Override
    public void broadcastListenerDetails() {
        broadcastData("listenerDetails", getOnlineListeners(), listenerEmitters);
    }

    @Override
    public void broadcastUserDetails() {
        broadcastData("userDetails", getOnlineUsers(), userEmitters);
    }

    @Override
    public List<UserActivityDTO> getAllOnlineUsers() {
        return new ArrayList<>(userDetailsCache.asMap().values());
    }

    @Override
    public List<UserRoleCountDTO> getOnlineUsersCountByRole() {
        List<UserRoleCountDTO> userRoleCounts = new ArrayList<>();
        userRoleCounts.add(new UserRoleCountDTO(Role.ADMIN.name(), getOnlineAdmins().size()));
        userRoleCounts.add(new UserRoleCountDTO(Role.LISTENER.name(), getOnlineListeners().size()));
        userRoleCounts.add(new UserRoleCountDTO(Role.USER.name(), getOnlineUsers().size()));
        return userRoleCounts;
    }

    @Override
    public List<UserActivityDTO> getOnlineAdmins() {
        return roleBasedDetailsCache.getIfPresent(Role.ADMIN.name()) != null ? roleBasedDetailsCache.getIfPresent(Role.ADMIN.name()) : new ArrayList<>();
    }

    @Override
    public List<UserActivityDTO> getOnlineListeners() {
        return roleBasedDetailsCache.getIfPresent(Role.LISTENER.name()) != null ? roleBasedDetailsCache.getIfPresent(Role.LISTENER.name()) : new ArrayList<>();
    }

    @Override
    public List<UserActivityDTO> getOnlineUsers() {
        return roleBasedDetailsCache.getIfPresent(Role.USER.name()) != null ? roleBasedDetailsCache.getIfPresent(Role.USER.name()) : new ArrayList<>();
    }

    @Override
    public void updateLastSeen(String email) {
        User user = userRepository.findByEmail(email);
        user.setIsActive(true);
        lastSeenCache.put(email, user.getLastSeen());
        UserActivityDTO dto = UserActivityMapper.toUserActivityDTO(user);
        // Remove stale cache data first
        userDetailsCache.invalidate(email);
        roleBasedDetailsCache.asMap()
                .values()
                .forEach(list -> list.removeIf(existingUser -> existingUser.getUserId().equals(dto.getUserId())));

        // Update cache
        userDetailsCache.put(email, dto);
        roleBasedDetailsCache.asMap()
                .computeIfAbsent(user.getRole().name(), k -> new CopyOnWriteArrayList<>())
                .add(dto);

        // Broadcast updated data
        broadcastAllUsers();
        broadcastRoleCounts();
        broadcastAdminDetails();
        broadcastListenerDetails();
        broadcastUserDetails();
    }

    @Override
    public List<String> findExpiredUsers() {
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
    public void markUserInactive(String email) {
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

