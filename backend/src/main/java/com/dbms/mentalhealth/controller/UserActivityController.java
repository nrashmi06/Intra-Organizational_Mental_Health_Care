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

    @GetMapping(SSEUrlMapping.SSE_ONLINE_USERS)
    public SseEmitter streamOnlineUsers() {
        SseEmitter emitter = userActivityService.createEmitter();
        userActivityService.addUserEmitter(emitter); // Add emitter to the list
        userActivityService.sendInitialCounts(emitter);
        return emitter;
    }

    @GetMapping(SSEUrlMapping.SSE_ONLINE_USERS_BY_ROLE)
    public SseEmitter streamOnlineUsersByRole() {
        SseEmitter emitter = userActivityService.createEmitter();
        userActivityService.addRoleEmitter(emitter); // Add emitter to the list
        userActivityService.sendInitialRoleCounts(emitter);
        return emitter;
    }
}