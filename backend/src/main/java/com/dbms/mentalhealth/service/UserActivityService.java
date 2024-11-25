package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.dto.UserActivity.UserActivityDTO;
import lombok.AllArgsConstructor;
import lombok.Data;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.util.List;

public interface UserActivityService {
    SseEmitter createEmitter();
    void addUserEmitter(SseEmitter emitter);
    void addRoleEmitter(SseEmitter emitter);
    void sendInitialCounts(SseEmitter emitter);
    void sendInitialRoleCounts(SseEmitter emitter);
    void sendRoleCountsToAll();
    void sendUserCountsToAll();
    List<UserActivityDTO> getOnlineUsers();
    List<UserRoleCount> getOnlineUsersByRole();

    @Data
    @AllArgsConstructor
    class UserRoleCount {
        private final String role;
        private final int count;
    }
}