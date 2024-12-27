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
import java.util.Arrays;
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

    private void sendInitialData(SseEmitter emitter, String mapKey, CopyOnWriteArrayList<SseEmitter> emitters) {
        try {
            logMapContents();
            List<UserActivityDTO> cachedData = roleBasedDetailsCache.getIfPresent(mapKey);
            if (cachedData == null) {
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
        return switch (key) {
            case "allUsers" -> getAllOnlineUsers();
            case "adminDetails" -> getOnlineAdmins();
            case "listenerDetails" -> getOnlineListeners();
            case "userDetails" -> getOnlineUsers();
            default -> throw new IllegalArgumentException("Unknown map key: " + key);
        };
    }

    @Override
    public void sendInitialAllUsers(SseEmitter emitter) {
        sendInitialData(emitter, "allUsers", allUserEmitters);
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
        log.info("Cache contents - User Details: {}, Role Based: {}, Last Seen: {}",
                userDetailsCache.asMap(), roleBasedDetailsCache.asMap(), lastSeenCache.asMap());
    }

    @Async
    @Override
    public void broadcastSessionDetails(List<SessionSummaryDTO> sessionSummaryDTOs) {
        sessionDetailsEmitters.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event().name("sessionDetails").data(sessionSummaryDTOs));
            } catch (IOException e) {
                log.error("Error broadcasting session details", e);
                sessionDetailsEmitters.remove(emitter);
            }
        });

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

    private <T> void broadcastData(String mapKey, List<T> data, CopyOnWriteArrayList<SseEmitter> emitterList) {
        if (data instanceof List<?>) {
            List<Object> updatedList = ((List<?>) data).stream()
                    .map(item -> item instanceof UserActivityDTO ?
                            UserActivityMapper.toUserActivityDTO((UserActivityDTO) item) : item)
                    .collect(Collectors.toList());

            emitterList.forEach(emitter -> {
                try {
                    emitter.send(SseEmitter.event().name(mapKey).data(updatedList));
                } catch (IOException e) {
                    log.error("Error broadcasting data for key: {}", mapKey, e);
                    emitterList.remove(emitter);
                }
            });
        }
    }

    @Override
    @Async
    public void broadcastAllUsers() {
        broadcastData("allUsers", getAllOnlineUsers(), allUserEmitters);
        broadcastFullCacheDetails();
    }

    @Override
    @Async
    public void broadcastRoleCounts() {
        List<UserRoleCountDTO> roleCounts = getOnlineUsersCountByRole();
        roleEmitters.forEach(emitter -> {
            try {
                emitter.send(SseEmitter.event().name("roleCounts").data(roleCounts));
            } catch (IOException e) {
                log.error("Error broadcasting role counts", e);
                roleEmitters.remove(emitter);
            }
        });
        broadcastFullCacheDetails();
    }

    @Override
    @Async
    public void broadcastAdminDetails() {
        broadcastData("adminDetails", getOnlineAdmins(), adminEmitters);
        broadcastFullCacheDetails();
    }

    @Override
    @Async
    public void broadcastListenerDetails() {
        broadcastData("listenerDetails", getOnlineListeners(), listenerEmitters);
        broadcastFullCacheDetails();
    }

    @Override
    @Async
    public void broadcastUserDetails() {
        broadcastData("userDetails", getOnlineUsers(), userEmitters);
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



    @Async
    @Override
    public void updateLastSeenStatus(String email) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            user.setIsActive(true);
            user.setLastSeen(LocalDateTime.now());
            userRepository.save(user);
            lastSeenCache.put(email, user.getLastSeen());

            UserActivityDTO dto = UserActivityMapper.toUserActivityDTO(user);

            // Update caches
            userDetailsCache.invalidate(email);
            roleBasedDetailsCache.asMap().forEach((role, list) -> {
                List<UserActivityDTO> mutableList = new ArrayList<>(list);
                mutableList.removeIf(existingUser -> existingUser.getUserId().equals(dto.getUserId()));
                roleBasedDetailsCache.put(role, mutableList);
            });

            userDetailsCache.put(email, dto);
            roleBasedDetailsCache.asMap()
                    .computeIfAbsent(user.getRole().name(), k -> new CopyOnWriteArrayList<>())
                    .add(dto);

            broadcastAllUsers();
            broadcastRoleCounts();
            broadcastAdminDetails();
            broadcastListenerDetails();
            broadcastUserDetails();
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
    public List<String> findExpiredUsers() {
        LocalDateTime now = LocalDateTime.now();
        return lastSeenCache.asMap().entrySet().stream()
                .filter(entry -> entry.getValue() != null &&
                        entry.getValue().isBefore(now.minusMinutes(5)))
                .map(Map.Entry::getKey)
                .collect(Collectors.toList());
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

            broadcastAllUsers();
            broadcastRoleCounts();
            broadcastAdminDetails();
            broadcastListenerDetails();
            broadcastUserDetails();
        }
    }
}