package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.notification.NotificationResponseDTO;
import com.dbms.mentalhealth.enums.NotificationStatus;
import com.dbms.mentalhealth.exception.sse.UserNotOnlineException;
import com.dbms.mentalhealth.mapper.NotificationMapper;
import com.dbms.mentalhealth.model.Notification;
import com.dbms.mentalhealth.repository.NotificationRepository;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.NotificationService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.web.servlet.mvc.method.annotation.SseEmitter;

import java.io.IOException;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.ConcurrentMap;

@Service
@Slf4j
@RequiredArgsConstructor
public class NotificationServiceImpl implements NotificationService {

    private final NotificationRepository notificationRepository;
    private final JwtUtils jwtUtils;

    // ConcurrentHashMap for thread-safe emitter management
    private final ConcurrentMap<Integer, SseEmitter> emitters = new ConcurrentHashMap<>();

    @Override
    public SseEmitter createEmitter(Integer userId) {
        // Create SseEmitter with a specific timeout (e.g., 30 seconds)
        SseEmitter emitter = new SseEmitter((long)Integer.MAX_VALUE);

        // Store emitter for the user
        emitters.put(userId, emitter);

        // Remove emitter on completion or timeout
        emitter.onCompletion(() -> {
            log.info("SSE Emitter completed for user: {}", userId);
            emitters.remove(userId);
        });

        emitter.onTimeout(() -> {
            log.warn("SSE Emitter timed out for user: {}", userId);
            emitters.remove(userId);
            emitter.complete();
        });

        // Optional: Send initial connection event
        sendInitialEvent(emitter, userId);

        return emitter;
    }

    private void sendInitialEvent(SseEmitter emitter, Integer userId) {
        try {
            emitter.send(SseEmitter.event()
                    .id(String.valueOf(userId))
                    .name("connection")
                    .data("Connected successfully"));
        } catch (IOException e) {
            log.error("Error sending initial SSE event for user {}: {}", userId, e.getMessage());
            emitters.remove(userId);
        }
    }

    @Override
    public void sendNotification(Notification notification) {
        Integer receiverId = notification.getReceiver().getUserId();
        SseEmitter emitter = emitters.get(receiverId);


        if (emitter == null) {
            throw new UserNotOnlineException("No active emitter found for user: " + receiverId);
        }

        try {
            NotificationResponseDTO responseDTO = NotificationMapper.toNotificationResponseDTO(notification);
            emitter.send(SseEmitter.event()
                    .id(String.valueOf(notification.getNotificationId()))
                    .name("notification")
                    .data(responseDTO));
            notification.setStatus(NotificationStatus.SENT);
            notificationRepository.save(notification);
        } catch (IOException e) {
            log.error("Failed to send notification to user {}: {}",
                    receiverId, e.getMessage());

            // Mark notification as failed
            notification.setStatus(NotificationStatus.FAILED);
            notificationRepository.save(notification);
            emitters.remove(receiverId);
        }
    }

    // Optional: Method to remove specific user's emitter
    public void removeEmitter(Integer userId) {
        SseEmitter emitter = emitters.remove(userId);
        if (emitter != null) {
            emitter.complete();
        }
    }
}