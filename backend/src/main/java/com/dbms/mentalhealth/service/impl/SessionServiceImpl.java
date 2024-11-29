package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.chatMessage.ChatMessageDTO;
import com.dbms.mentalhealth.enums.MessageType;
import com.dbms.mentalhealth.enums.SessionStatus;
import com.dbms.mentalhealth.exception.user.UserNotFoundException;
import com.dbms.mentalhealth.model.Listener;
import com.dbms.mentalhealth.model.Notification;
import com.dbms.mentalhealth.model.Session;
import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.repository.ListenerRepository;
import com.dbms.mentalhealth.repository.NotificationRepository;
import com.dbms.mentalhealth.repository.SessionRepository;
import com.dbms.mentalhealth.repository.UserRepository;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.NotificationService;
import com.dbms.mentalhealth.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SessionServiceImpl implements SessionService {

    private final SimpMessagingTemplate messageTemplate;
    private final NotificationService notificationService;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final ListenerRepository listenerRepository;
    private final SessionRepository sessionRepository;
    private final NotificationRepository notificationRepository;

    @Autowired
    public SessionServiceImpl(SimpMessagingTemplate messageTemplate, NotificationService notificationService, JwtUtils jwtUtils, UserRepository userRepository, ListenerRepository listenerRepository, SessionRepository sessionRepository, NotificationRepository notificationRepository) {
        this.messageTemplate = messageTemplate;
        this.notificationService = notificationService;
        this.jwtUtils = jwtUtils;
        this.userRepository = userRepository;
        this.listenerRepository = listenerRepository;
        this.sessionRepository = sessionRepository;
        this.notificationRepository = notificationRepository;
    }

    @Override
    public String getActiveSessions() {
        return "Active sessions data";
    }

    @Override
    public String initiateSession(Integer listenerId, String message) {
        User sender = userRepository.findById(jwtUtils.getUserIdFromContext()).orElse(null);
        User receiver = userRepository.findById(listenerId).orElse(null);
        if (sender == null || receiver == null) {
            throw new UserNotFoundException("User not found");
        }

        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setReceiver(receiver);
        notification.setSender(sender);
        notificationService.sendNotification(notification);

        return "Session request sent to listener";
    }

    @Override
    public String updateSessionStatus(Integer userId, String action) {
        Integer loggedInUserId = jwtUtils.getUserIdFromContext();
        Listener listener = listenerRepository.findByUser_UserId(loggedInUserId)
                .orElseThrow(() -> new IllegalStateException("Listener not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new IllegalStateException("User not found"));

        String message;
        if ("accept".equalsIgnoreCase(action)) {
            Session session = new Session();
            session.setListener(listener);
            session.setUser(user);
            session.setSessionStatus(SessionStatus.ONGOING);
            session.setSessionStart(LocalDateTime.now());
            sessionRepository.save(session);

            // Notify users about the new WebSocket endpoint
            String websocketEndpoint = "/topic/session/" + session.getSessionId();
            message = "Your session request has been accepted by listener " + listener.getUser().getAnonymousName() + ". Session starting soon. Join the chat at: " + websocketEndpoint;

            // Send WebSocket notification to both users
            ChatMessageDTO chatMessageDTO = new ChatMessageDTO();
            chatMessageDTO.setType(MessageType.JOIN);
            chatMessageDTO.setSender(listener.getUser().getAnonymousName());
            chatMessageDTO.setContent("Session started. Join the chat at: " + websocketEndpoint);
            messageTemplate.convertAndSend(websocketEndpoint, chatMessageDTO);

            // Send SSE notification to both users
            sendSseNotification(user, listener.getUser(), message);
            sendSseNotification(listener.getUser(), user, message);
        } else if ("reject".equalsIgnoreCase(action)) {
            message = "Your session request has been rejected by listener " + listener.getUser().getAnonymousName() + ".";
            sendSseNotification(listener.getUser(), user, message);
        } else {
            return "Invalid action";
        }

        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setReceiver(user);
        notification.setSender(listener.getUser());
        notificationRepository.save(notification);
        notificationService.sendNotification(notification);

        return "Session " + action + "ed";
    }

    private void sendSseNotification(User sender, User receiver, String message) {
        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setReceiver(receiver);
        notification.setSender(sender);
        notificationService.sendNotification(notification);
    }

    @Override
    public String getSessionById(Integer sessionId) {
        return "Session details for ID: " + sessionId;
    }

    @Override
    public String getAllSessions() {
        return "All session details";
    }
}