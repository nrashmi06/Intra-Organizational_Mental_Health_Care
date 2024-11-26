package com.dbms.mentalhealth.controller;

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
        SseEmitter emitter = userActivityService.createEmitter();
        userActivityService.addAllUsersEmitter(emitter);
        userActivityService.sendInitialAllUsers(emitter);
        return emitter;
    }

    @GetMapping(SSEUrlMapping.SSE_ONLINE_USERS_COUNT_BY_ROLE)
    public SseEmitter streamOnlineUsersByRoleCount() {
        SseEmitter emitter = userActivityService.createEmitter();
        userActivityService.addRoleCountEmitter(emitter);
        userActivityService.sendInitialRoleCounts(emitter);
        return emitter;
    }

    @GetMapping(SSEUrlMapping.SSE_ONLINE_ADMINS)
    public SseEmitter streamOnlineAdmins() {
        SseEmitter emitter = userActivityService.createEmitter();
        userActivityService.addAdminEmitter(emitter);
        userActivityService.sendInitialAdminDetails(emitter);
        return emitter;
    }

    @GetMapping(SSEUrlMapping.SSE_ONLINE_LISTENERS)
    public SseEmitter streamOnlineListeners() {
        SseEmitter emitter = userActivityService.createEmitter();
        userActivityService.addListenerEmitter(emitter);
        userActivityService.sendInitialListenerDetails(emitter);
        return emitter;
    }

    @GetMapping(SSEUrlMapping.SSE_ONLINE_USERS)
    public SseEmitter streamOnlineUsers() {
        SseEmitter emitter = userActivityService.createEmitter();
        userActivityService.addUserEmitter(emitter);
        userActivityService.sendInitialUserDetails(emitter);
        return emitter;
    }
}