package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.service.NotificationService;
import com.dbms.mentalhealth.urlMapper.NotificationUrlMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping(NotificationUrlMapping.SUBSCRIBE_NOTIFICATIONS)
    public SseEmitter subscribeToNotifications(@RequestParam("token") String token, @RequestParam("userId") Integer userId) {
        return notificationService.createEmitter(userId);
    }

}