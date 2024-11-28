package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.notification.response.NotificationResponseDTO;
import com.dbms.mentalhealth.enums.NotificationStatus;
import com.dbms.mentalhealth.mapper.NotificationMapper;
import com.dbms.mentalhealth.model.Notification;
import com.dbms.mentalhealth.repository.NotificationRepository;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final ConcurrentMap<Integer, SseEmitter> emitters = new ConcurrentHashMap<>();
    private final JwtUtils jwtUtils;

    @Autowired
    public NotificationServiceImpl(NotificationRepository notificationRepository, JwtUtils jwtUtils) {
        this.notificationRepository = notificationRepository;
        this.jwtUtils = jwtUtils;
    }

    @Override
    public SseEmitter createEmitter() {
        SseEmitter emitter = new SseEmitter(Long.MAX_VALUE); // Infinite timeout
        Integer userId = jwtUtils.getUserIdFromContext();
        emitters.put(userId, emitter);
        emitter.onCompletion(() -> emitters.remove(userId));
        emitter.onTimeout(() -> emitters.remove(userId));

        // Send an initial empty event to the frontend
        try {
            emitter.send(SseEmitter.event().name("initial").data(""));
        } catch (IOException e) {
            emitters.remove(userId);
        }

        return emitter;
    }

    @Override
    public void sendNotification(Notification notification) {
        Integer receiverId = notification.getReceiver().getUserId();
        SseEmitter emitter = emitters.get(receiverId);
        notification.setStatus(NotificationStatus.SENT);
        notificationRepository.save(notification);
        if (emitter != null) {
            try {
                NotificationResponseDTO notificationResponseDTO = NotificationMapper.toNotificationResponseDTO(notification);
                emitter.send(SseEmitter.event().name("notification from: " + notification.getSender().getAnonymousName()).data(notificationResponseDTO));
            } catch (IOException e) {
                emitters.remove(receiverId);
                notification.setStatus(NotificationStatus.FAILED);
                notificationRepository.save(notification);
            }
        }
    }
}