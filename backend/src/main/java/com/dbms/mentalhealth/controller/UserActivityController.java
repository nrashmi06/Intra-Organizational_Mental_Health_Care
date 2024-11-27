package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.exception.sse.EmitterCreationException;
import com.dbms.mentalhealth.service.UserActivityService;
import com.dbms.mentalhealth.urlMapper.SSEUrlMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
public class UserActivityController {

    private final UserActivityService userActivityService;

    public UserActivityController(UserActivityService userActivityService) {
        this.userActivityService = userActivityService;
    }

    @GetMapping(SSEUrlMapping.SSE_ALL_ONLINE_USERS)
    public SseEmitter streamAllOnlineUsers() {
        try {
            SseEmitter emitter = userActivityService.createEmitter();
            userActivityService.addAllUsersEmitter(emitter);
            userActivityService.sendInitialAllUsers(emitter);
            return emitter;
        } catch (Exception e) {
            throw new EmitterCreationException("Failed to create emitter for all online users");
        }
    }

    @GetMapping(SSEUrlMapping.SSE_ONLINE_USERS_COUNT_BY_ROLE)
    public SseEmitter streamOnlineUsersByRoleCount() {
        try {
            SseEmitter emitter = userActivityService.createEmitter();
            userActivityService.addRoleCountEmitter(emitter);
            userActivityService.sendInitialRoleCounts(emitter);
            return emitter;
        } catch (Exception e) {
            throw new EmitterCreationException("Failed to create emitter for online users count by role");
        }
    }

    @GetMapping(SSEUrlMapping.SSE_ONLINE_ADMINS)
    public SseEmitter streamOnlineAdmins() {
        try {
            SseEmitter emitter = userActivityService.createEmitter();
            userActivityService.addAdminEmitter(emitter);
            userActivityService.sendInitialAdminDetails(emitter);
            return emitter;
        } catch (Exception e) {
            throw new EmitterCreationException("Failed to create emitter for online admins");
        }
    }

    @GetMapping(SSEUrlMapping.SSE_ONLINE_LISTENERS)
    public SseEmitter streamOnlineListeners() {
        try {
            SseEmitter emitter = userActivityService.createEmitter();
            userActivityService.addListenerEmitter(emitter);
            userActivityService.sendInitialListenerDetails(emitter);
            return emitter;
        } catch (Exception e) {
            throw new EmitterCreationException("Failed to create emitter for online listeners");
        }
    }

    @GetMapping(SSEUrlMapping.SSE_ONLINE_USERS)
    public SseEmitter streamOnlineUsers() {
        try {
            SseEmitter emitter = userActivityService.createEmitter();
            userActivityService.addUserEmitter(emitter);
            userActivityService.sendInitialUserDetails(emitter);
            return emitter;
        } catch (Exception e) {
            throw new EmitterCreationException("Failed to create emitter for online users");
        }
    }

    @GetMapping(SSEUrlMapping.HEARTBEAT)
    public String heartbeat() {
        return "OK";
    }
}