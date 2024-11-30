package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.service.NotificationService;
import com.dbms.mentalhealth.urlMapper.NotificationUrlMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

@RestController
public class NotificationController {

    private final NotificationService notificationService;

    @Autowired
    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    @GetMapping(NotificationUrlMapping.SUBSCRIBE_NOTIFICATIONS)
    public SseEmitter subscribeToNotifications() {
        return notificationService.createEmitter();
    }

}