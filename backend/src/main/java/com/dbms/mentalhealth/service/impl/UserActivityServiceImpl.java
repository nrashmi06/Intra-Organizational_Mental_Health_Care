package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.UserActivity.UserActivityDTO;
import com.dbms.mentalhealth.dto.UserActivity.UserRoleCountDTO;
import com.dbms.mentalhealth.enums.Role;
import com.dbms.mentalhealth.mapper.UserActivityMapper;
import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.repository.UserRepository;
import com.dbms.mentalhealth.service.UserActivityService;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
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

    private final UserRepository userRepository;

    private final Cache<String, Object> cache;

    public UserActivityServiceImpl(UserRepository userRepository, Caffeine<Object, Object> caffeine) {
        this.userRepository = userRepository;
        this.cache = caffeine.build();
    }

    @Override
    public SseEmitter createEmitter() {
        return new SseEmitter(TimeUnit.MINUTES.toMillis(30)); // 30-minute timeout
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
            Object cachedData = cache.getIfPresent(cacheKey);
            if (cachedData == null) {
                cachedData = fetchDataForKey(cacheKey);
                cache.put(cacheKey, cachedData);
            }
            emitter.send(SseEmitter.event().name(cacheKey).data(cachedData));
        } catch (IOException e) {
            emitters.remove(emitter);
        }
    }

    private Object fetchDataForKey(String key) {
        switch (key) {
            case "allUsers":
                return getAllOnlineUsers();
            case "roleCounts":
                return getOnlineUsersCountByRole();
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

    @Override
    public void sendInitialAllUsers(SseEmitter emitter) {
        sendInitialData(emitter, "allUsers", allUserEmitters);
    }

    @Override
    public void sendInitialRoleCounts(SseEmitter emitter) {
        sendInitialData(emitter, "roleCounts", roleEmitters);
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

    private <T> void broadcastData(String cacheKey, List<T> data, CopyOnWriteArrayList<SseEmitter> emitterList) {
        if (data != null) {
            cache.put(cacheKey, data);
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
        broadcastData("roleCounts", getOnlineUsersCountByRole(), roleEmitters);
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
        return userRepository.findAll().stream()
                .filter(User::getIsActive)
                .map(UserActivityMapper::toUserActivityDTO)
                .toList();
    }

    @Override
    public List<UserRoleCountDTO> getOnlineUsersCountByRole() {
        return userRepository.findAll().stream()
                .filter(User::getIsActive)
                .collect(Collectors.groupingBy(user -> user.getRole().name(), Collectors.counting()))
                .entrySet().stream()
                .map(UserActivityMapper::toUserRoleCountDTO)
               .toList();
    }

    @Override
    public List<UserActivityDTO> getOnlineAdmins() {
        return userRepository.findAll().stream()
                .filter(user -> user.getIsActive() && user.getRole().equals(Role.ADMIN))
                .map(UserActivityMapper::toUserActivityDTO)
                .toList();
    }

    @Override
    public List<UserActivityDTO> getOnlineListeners() {
        return userRepository.findAll().stream()
                .filter(user -> user.getIsActive() && user.getRole().equals(Role.LISTENER))
                .map(UserActivityMapper::toUserActivityDTO)
                .toList();
    }

    @Override
    public List<UserActivityDTO> getOnlineUsers() {
        return userRepository.findAll().stream()
                .filter(user -> user.getIsActive() && user.getRole().equals(Role.USER))
                .map(UserActivityMapper::toUserActivityDTO)
                .toList();
    }

    @Override
    public void updateLastSeen(String email) {
        cache.put(email, LocalDateTime.now());
        broadcastAllUsers();
        broadcastRoleCounts();
        broadcastAdminDetails();
        broadcastListenerDetails();
        broadcastUserDetails();
    }

    @Override
    public void checkInactiveUsers() {
        LocalDateTime now = LocalDateTime.now();
        userRepository.findAll().stream()
                .filter(user -> user.getIsActive() && cache.getIfPresent(user.getEmail()) != null
                        && ((LocalDateTime) cache.getIfPresent(user.getEmail())).isBefore(now.minusMinutes(5)))
                .forEach(user -> {
                    user.setIsActive(false);
                    userRepository.save(user);
                    cache.invalidate(user.getEmail());
                });
        broadcastAllUsers();
        broadcastRoleCounts();
        broadcastAdminDetails();
        broadcastListenerDetails();
        broadcastUserDetails();
    }
}
