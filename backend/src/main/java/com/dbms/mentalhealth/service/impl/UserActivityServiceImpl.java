package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.UserActivity.UserActivityDTO;
import com.dbms.mentalhealth.dto.UserActivity.UserRoleCountDTO;
import com.dbms.mentalhealth.enums.Role;
import com.dbms.mentalhealth.mapper.UserActivityMapper;
import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.repository.UserRepository;
import com.dbms.mentalhealth.service.UserActivityService;
import org.slf4j.Logger;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;
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

    private final Map<String, UserActivityDTO> userDetailsMap = new ConcurrentHashMap<>();
    private final Map<String, List<UserActivityDTO>> roleBasedDetailsMap = new ConcurrentHashMap<>();
    private final Map<String, LocalDateTime> lastSeenMap = new ConcurrentHashMap<>();

    public UserActivityServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
        initializeMaps();
    }

    private void initializeMaps() {
        List<User> activeUsers = userRepository.findByIsActive(true);
        activeUsers.forEach(user -> {
            UserActivityDTO dto = UserActivityMapper.toUserActivityDTO(user);
            userDetailsMap.put(user.getEmail(), dto);
            roleBasedDetailsMap.computeIfAbsent(user.getRole().name(), k -> new CopyOnWriteArrayList<>()).add(dto);
            lastSeenMap.put(user.getEmail(), user.getLastSeen());
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

    private void sendInitialData(SseEmitter emitter, String mapKey, CopyOnWriteArrayList<SseEmitter> emitters) {
        try {
            logMapContents();
            List<UserActivityDTO> cachedData = roleBasedDetailsMap.get(mapKey);
            if (cachedData == null) {
                cachedData = fetchUserActivityDataForKey(mapKey);
                roleBasedDetailsMap.put(mapKey, cachedData);
            }
            emitter.send(SseEmitter.event().name(mapKey).data(cachedData));
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

    private void logMapContents() {
        log.info("User Details Map: {}", userDetailsMap);
        log.info("Role Based Details Map: {}", roleBasedDetailsMap);
        log.info("Last Seen Map: {}", lastSeenMap);
    }

    private <T> void broadcastData(String mapKey, List<T> data, CopyOnWriteArrayList<SseEmitter> emitterList) {
        logMapContents();
        if (data != null) {
            for (SseEmitter emitter : emitterList) {
                try {
                    emitter.send(SseEmitter.event().name(mapKey).data(data));
                } catch (IOException e) {
                    emitterList.remove(emitter);
                }
            }
        }
    }

    @Override
    @Async
    public void broadcastAllUsers() {
        broadcastData("allUsers", getAllOnlineUsers(), allUserEmitters);
    }

    @Override
    @Async
    public void broadcastRoleCounts() {
        try {
            List<UserRoleCountDTO> cachedData = fetchUserRoleCountDataForKey("roleCounts");
            for (SseEmitter emitter : roleEmitters) {
                try {
                    emitter.send(SseEmitter.event().name("roleCounts").data(cachedData));
                    log.info("User Details Map: {}", cachedData);
                } catch (IOException e) {
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
        broadcastData("adminDetails", getOnlineAdmins(), adminEmitters);
    }

    @Override
    @Async
    public void broadcastListenerDetails() {
        broadcastData("listenerDetails", getOnlineListeners(), listenerEmitters);
    }

    @Override
    @Async
    public void broadcastUserDetails() {
        broadcastData("userDetails", getOnlineUsers(), userEmitters);
    }

    @Override
    public List<UserActivityDTO> getAllOnlineUsers() {
        return new ArrayList<>(userDetailsMap.values());
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
        return roleBasedDetailsMap.getOrDefault(Role.ADMIN.name(), new ArrayList<>());
    }

    @Override
    public List<UserActivityDTO> getOnlineListeners() {
        return roleBasedDetailsMap.getOrDefault(Role.LISTENER.name(), new ArrayList<>());
    }

    @Override
    public List<UserActivityDTO> getOnlineUsers() {
        return roleBasedDetailsMap.getOrDefault(Role.USER.name(), new ArrayList<>());
    }

    @Override
    @Async
    public void updateLastSeen(String email) {
        User user = userRepository.findByEmail(email);
        user.setIsActive(true);
        user.setLastSeen(LocalDateTime.now());
        userRepository.save(user);
        lastSeenMap.put(email, user.getLastSeen());
        UserActivityDTO dto = UserActivityMapper.toUserActivityDTO(user);
        // Remove stale map data first
        userDetailsMap.remove(email);
        roleBasedDetailsMap.values().forEach(list -> list.removeIf(existingUser -> existingUser.getUserId().equals(dto.getUserId())));

        // Update map
        userDetailsMap.put(email, dto);
        roleBasedDetailsMap.computeIfAbsent(user.getRole().name(), k -> new CopyOnWriteArrayList<>()).add(dto);

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
        return lastSeenMap.entrySet().stream()
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
        User user = userRepository.findByEmail(email);
        if (user != null && user.getIsActive()) {
            user.setIsActive(false);
            userRepository.save(user);

            lastSeenMap.remove(email);
            userDetailsMap.remove(email);
            roleBasedDetailsMap.values().forEach(list -> {
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