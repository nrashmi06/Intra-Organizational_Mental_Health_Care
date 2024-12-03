package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.exception.sse.EmitterCreationException;
import com.dbms.mentalhealth.service.UserActivityService;
import com.dbms.mentalhealth.urlMapper.SSEUrlMapping;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
public class UserActivityController {

    private final UserActivityService userActivityService;

    public UserActivityController(UserActivityService userActivityService) {
        this.userActivityService = userActivityService;
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(SSEUrlMapping.SSE_ALL_ONLINE_USERS)
    public SseEmitter streamAllOnlineUsers(@RequestParam("token") String token) {
        try {
            SseEmitter emitter = userActivityService.createEmitter();
            userActivityService.addAllUsersEmitter(emitter);
            userActivityService.sendInitialAllUsers(emitter);
            return emitter;
        } catch (Exception e) {
            throw new EmitterCreationException("Failed to create emitter for all online users");
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(SSEUrlMapping.SSE_ONLINE_USERS_COUNT_BY_ROLE)
    public SseEmitter streamOnlineUsersByRoleCount(@RequestParam("token") String token) {
        try {
            SseEmitter emitter = userActivityService.createEmitter();
            userActivityService.addRoleCountEmitter(emitter);
            userActivityService.sendInitialRoleCounts(emitter);
            return emitter;
        } catch (Exception e) {
            throw new EmitterCreationException("Failed to create emitter for online users count by role");
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(SSEUrlMapping.SSE_ONLINE_ADMINS)
    public SseEmitter streamOnlineAdmins(@RequestParam("token") String token) {
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
    public SseEmitter streamOnlineListeners(@RequestParam("token") String token) {
        try {
            SseEmitter emitter = userActivityService.createEmitter();
            userActivityService.addListenerEmitter(emitter);
            userActivityService.sendInitialListenerDetails(emitter);
            return emitter;
        } catch (Exception e) {
            throw new EmitterCreationException("Failed to create emitter for online listeners");
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(SSEUrlMapping.SSE_ONLINE_USERS)
    public SseEmitter streamOnlineUsers(@RequestParam("token") String token) {
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
    public String heartbeat(@RequestParam("token") String token) {
        return "OK";
    }
}