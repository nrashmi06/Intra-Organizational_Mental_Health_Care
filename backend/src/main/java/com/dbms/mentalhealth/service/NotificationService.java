package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.model.Notification;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

public interface NotificationService {
    SseEmitter createEmitter();
    void sendNotification(Notification notification);
}