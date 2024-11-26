package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.dto.UserActivity.UserActivityDTO;
import com.dbms.mentalhealth.dto.UserActivity.UserRoleCountDTO;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

public interface UserActivityService {
    SseEmitter createEmitter();

    void addAllUsersEmitter(SseEmitter emitter);
    void addRoleCountEmitter(SseEmitter emitter);
    void addAdminEmitter(SseEmitter emitter);
    void addListenerEmitter(SseEmitter emitter);
    void addUserEmitter(SseEmitter emitter);

    void sendInitialAllUsers(SseEmitter emitter);
    void sendInitialRoleCounts(SseEmitter emitter);
    void sendInitialAdminDetails(SseEmitter emitter);
    void sendInitialListenerDetails(SseEmitter emitter);
    void sendInitialUserDetails(SseEmitter emitter);

    void broadcastAllUsers();
    void broadcastRoleCounts();
    void broadcastAdminDetails();
    void broadcastListenerDetails();
    void broadcastUserDetails();

    List<UserActivityDTO> getAllOnlineUsers();
    List<UserRoleCountDTO> getOnlineUsersCountByRole();
    List<UserActivityDTO> getOnlineAdmins();
    List<UserActivityDTO> getOnlineListeners();
    List<UserActivityDTO> getOnlineUsers();
    void markUserInactive(String email);

    void updateLastSeen(String email);
}