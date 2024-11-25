package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.UserActivity.UserActivityDTO;
import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.repository.UserRepository;
import com.dbms.mentalhealth.service.UserActivityService;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.List;
import java.util.concurrent.CopyOnWriteArrayList;
import java.util.concurrent.TimeUnit;
import java.util.stream.Collectors;

@Service
public class UserActivityServiceImpl implements UserActivityService {

    private final CopyOnWriteArrayList<SseEmitter> userEmitters = new CopyOnWriteArrayList<>();
    private final CopyOnWriteArrayList<SseEmitter> roleEmitters = new CopyOnWriteArrayList<>();
    private final UserRepository userRepository;

    public UserActivityServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public SseEmitter createEmitter() {
        return new SseEmitter(TimeUnit.MINUTES.toMillis(30)); // Set a 30-minute timeout
    }

    @Override
    public void addUserEmitter(SseEmitter emitter) {
        userEmitters.add(emitter);
        emitter.onCompletion(() -> userEmitters.remove(emitter));
        emitter.onTimeout(() -> userEmitters.remove(emitter));
        emitter.onError((e) -> userEmitters.remove(emitter));
    }

    @Override
    public void addRoleEmitter(SseEmitter emitter) {
        roleEmitters.add(emitter);
        emitter.onCompletion(() -> roleEmitters.remove(emitter));
        emitter.onTimeout(() -> roleEmitters.remove(emitter));
        emitter.onError((e) -> roleEmitters.remove(emitter));
    }

    @Override
    public void sendInitialCounts(SseEmitter emitter) {
        try {
            emitter.send(SseEmitter.event().name("initialCounts").data(getOnlineUsers()));
        } catch (IOException e) {
            userEmitters.remove(emitter);
        }
    }

    @Override
    public void sendInitialRoleCounts(SseEmitter emitter) {
        try {
            emitter.send(SseEmitter.event().name("initialRoleCounts").data(getOnlineUsersByRole()));
        } catch (IOException e) {
            roleEmitters.remove(emitter);
        }
    }

    @Override
    public void sendRoleCountsToAll() {
        for (SseEmitter emitter : roleEmitters) {
            try {
                emitter.send(SseEmitter.event().name("roleCounts").data(getOnlineUsersByRole()));
            } catch (IOException e) {
                roleEmitters.remove(emitter);
            }
        }
    }

    @Override
    public void sendUserCountsToAll() {
        for (SseEmitter emitter : userEmitters) {
            try {
                emitter.send(SseEmitter.event().name("userCounts").data(getOnlineUsers()));
            } catch (IOException e) {
                userEmitters.remove(emitter);
            }
        }
    }

    @Override
    public List<UserActivityDTO> getOnlineUsers() {
        return userRepository.findAll().stream()
                .filter(User::getIsActive)
                .map(user -> new UserActivityDTO(user.getUserId(), user.getAnonymousName()))
                .toList();
    }

    @Override
    public List<UserRoleCount> getOnlineUsersByRole() {
        return userRepository.findAll().stream()
                .filter(User::getIsActive)
                .collect(Collectors.groupingBy(User::getRole))
                .entrySet().stream()
                .map(entry -> new UserRoleCount(entry.getKey().name(), entry.getValue().size()))
                .toList();
    }
}