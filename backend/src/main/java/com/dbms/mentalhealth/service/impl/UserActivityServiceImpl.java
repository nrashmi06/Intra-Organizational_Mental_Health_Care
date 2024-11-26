package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.UserActivity.UserActivityDTO;
import com.dbms.mentalhealth.dto.UserActivity.UserRoleCountDTO;
import com.dbms.mentalhealth.enums.Role;
import com.dbms.mentalhealth.mapper.UserActivityMapper;
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

    private final CopyOnWriteArrayList<SseEmitter> allUserEmitters = new CopyOnWriteArrayList<>();
    private final CopyOnWriteArrayList<SseEmitter> roleEmitters = new CopyOnWriteArrayList<>();
    private final CopyOnWriteArrayList<SseEmitter> adminEmitters = new CopyOnWriteArrayList<>();
    private final CopyOnWriteArrayList<SseEmitter> listenerEmitters = new CopyOnWriteArrayList<>();
    private final CopyOnWriteArrayList<SseEmitter> userEmitters = new CopyOnWriteArrayList<>();
    private final UserRepository userRepository;

    public UserActivityServiceImpl(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @Override
    public SseEmitter createEmitter() {
        return new SseEmitter(TimeUnit.MINUTES.toMillis(30)); // Set a 30-minute timeout
    }

    @Override
    public void addAllUsersEmitter(SseEmitter emitter) {
        allUserEmitters.add(emitter);
        emitter.onCompletion(() -> allUserEmitters.remove(emitter));
        emitter.onTimeout(() -> allUserEmitters.remove(emitter));
        emitter.onError((e) -> allUserEmitters.remove(emitter));
    }

    @Override
    public void addRoleCountEmitter(SseEmitter emitter) {
        roleEmitters.add(emitter);
        emitter.onCompletion(() -> roleEmitters.remove(emitter));
        emitter.onTimeout(() -> roleEmitters.remove(emitter));
        emitter.onError((e) -> roleEmitters.remove(emitter));
    }

    @Override
    public void addAdminEmitter(SseEmitter emitter) {
        adminEmitters.add(emitter);
        emitter.onCompletion(() -> adminEmitters.remove(emitter));
        emitter.onTimeout(() -> adminEmitters.remove(emitter));
        emitter.onError((e) -> adminEmitters.remove(emitter));
    }

    @Override
    public void addListenerEmitter(SseEmitter emitter) {
        listenerEmitters.add(emitter);
        emitter.onCompletion(() -> listenerEmitters.remove(emitter));
        emitter.onTimeout(() -> listenerEmitters.remove(emitter));
        emitter.onError((e) -> listenerEmitters.remove(emitter));
    }

    @Override
    public void addUserEmitter(SseEmitter emitter) {
        userEmitters.add(emitter);
        emitter.onCompletion(() -> userEmitters.remove(emitter));
        emitter.onTimeout(() -> userEmitters.remove(emitter));
        emitter.onError((e) -> userEmitters.remove(emitter));
    }

    @Override
    public void sendInitialAllUsers(SseEmitter emitter) {
        try {
            emitter.send(SseEmitter.event().name("initialAllUsers").data(this.getAllOnlineUsers()));
        } catch (IOException e) {
            allUserEmitters.remove(emitter);
        }
    }

    @Override
    public void sendInitialRoleCounts(SseEmitter emitter) {
        try {
            emitter.send(SseEmitter.event().name("initialRoleCounts").data(getOnlineUsersCountByRole()));
        } catch (IOException e) {
            roleEmitters.remove(emitter);
        }
    }

    @Override
    public void sendInitialAdminDetails(SseEmitter emitter) {
        try {
            emitter.send(SseEmitter.event().name("initialAdmins").data(getOnlineAdmins()));
        } catch (IOException e) {
            adminEmitters.remove(emitter);
        }
    }

    @Override
    public void sendInitialListenerDetails(SseEmitter emitter) {
        try {
            emitter.send(SseEmitter.event().name("initialListeners").data(getOnlineListeners()));
        } catch (IOException e) {
            listenerEmitters.remove(emitter);
        }
    }

    @Override
    public void sendInitialUserDetails(SseEmitter emitter) {
        try {
            emitter.send(SseEmitter.event().name("initialUsers").data(this.getOnlineUsers()));
        } catch (IOException e) {
            userEmitters.remove(emitter);
        }
    }

    @Override
    public void broadcastAllUsers() {
        for (SseEmitter emitter : allUserEmitters) {
            try {
                emitter.send(SseEmitter.event().name("allUsers").data(this.getAllOnlineUsers()));
            } catch (IOException e) {
                allUserEmitters.remove(emitter);
            }
        }
    }

    @Override
    public void broadcastRoleCounts() {
        for (SseEmitter emitter : roleEmitters) {
            try {
                emitter.send(SseEmitter.event().name("roleCounts").data(getOnlineUsersCountByRole()));
            } catch (IOException e) {
                roleEmitters.remove(emitter);
            }
        }
    }

    @Override
    public void broadcastAdminDetails() {
        for (SseEmitter emitter : adminEmitters) {
            try {
                emitter.send(SseEmitter.event().name("adminDetails").data(this.getOnlineAdmins()));
            } catch (IOException e) {
                adminEmitters.remove(emitter);
            }
        }
    }

    @Override
    public void broadcastListenerDetails() {
        for (SseEmitter emitter : listenerEmitters) {
            try {
                emitter.send(SseEmitter.event().name("listenerDetails").data(this.getOnlineListeners()));
            } catch (IOException e) {
                listenerEmitters.remove(emitter);
            }
        }
    }

    @Override
    public void broadcastUserDetails() {
        for (SseEmitter emitter : userEmitters) {
            try {
                emitter.send(SseEmitter.event().name("userDetails").data(this.getOnlineUsers()));
            } catch (IOException e) {
                userEmitters.remove(emitter);
            }
        }
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
}