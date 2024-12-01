package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.config.WebSocketServer;
import com.dbms.mentalhealth.dto.chatMessage.ChatMessageDTO;
import com.dbms.mentalhealth.enums.SessionStatus;
import com.dbms.mentalhealth.exception.listener.ListenerNotFoundException;
import com.dbms.mentalhealth.exception.session.SessionNotFoundException;
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
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
@Slf4j
public class SessionServiceImpl implements SessionService {

    private final NotificationService notificationService;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final ListenerRepository listenerRepository;
    private final SessionRepository sessionRepository;
    private final NotificationRepository notificationRepository;

    @Autowired
    public SessionServiceImpl(NotificationService notificationService,
                              JwtUtils jwtUtils,
                              UserRepository userRepository,
                              ListenerRepository listenerRepository,
                              SessionRepository sessionRepository,
                              NotificationRepository notificationRepository) {
        this.notificationService = notificationService;
        this.jwtUtils = jwtUtils;
        this.userRepository = userRepository;
        this.listenerRepository = listenerRepository;
        this.sessionRepository = sessionRepository;
        this.notificationRepository = notificationRepository;
    }

    @Override
    public String getActiveSessions() {
        // Implement logic to retrieve active sessions
        return "Implement active sessions retrieval";
    }

    @Override
    public String initiateSession(Integer listenerId, String message) {
        User sender = userRepository.findById(jwtUtils.getUserIdFromContext())
                .orElseThrow(() -> new UserNotFoundException("Sender not found"));
        User receiver = userRepository.findById(listenerId)
                .orElseThrow(() -> new ListenerNotFoundException("Receiver not found"));

        // Create a notification
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
                .orElseThrow(() -> new ListenerNotFoundException("Listener not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        String message;
        if ("accept".equalsIgnoreCase(action)) {
            // Create and save session
            Session session = new Session();
            session.setListener(listener);
            session.setUser(user);
            session.setSessionStatus(SessionStatus.ONGOING);
            session.setSessionStart(LocalDateTime.now());
            sessionRepository.save(session);

            // Prepare session notification
            message = "Your session request has been accepted by listener " +
                    listener.getUser().getAnonymousName() +
                    ". Session starting soon";

            // Send notification to user only
            sendSseNotification(user, listener.getUser(), message);

            // Log the session details
            log.info("New session created - Session ID: {}, User: {}, Listener: {}",
                    session.getSessionId(), user.getAnonymousName(), listener.getUser().getAnonymousName());

            return "Session starting soon";
        } else if ("reject".equalsIgnoreCase(action)) {
            message = "Your session request has been rejected by listener " +
                    listener.getUser().getAnonymousName() + ".";

            // Send notification to user only
            sendSseNotification(user, listener.getUser(), message);

            return "Session not accepted";
        } else {
            return "Invalid action";
        }
    }

    private void sendSseNotification(User receiver, User listener, String message) {
        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setReceiver(receiver);
        notification.setSender(listener);
        notificationRepository.save(notification);
        notificationService.sendNotification(notification);
    }

    @Override
    public String getSessionById(Integer sessionId) {
        // Implement logic to retrieve session details
        return "Session details for ID: " + sessionId;
    }

    @Override
    public String endSession(Integer sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new SessionNotFoundException("Session not found"));

        session.setSessionStatus(SessionStatus.COMPLETED);
        session.setSessionEnd(LocalDateTime.now());
        sessionRepository.save(session);

        // Notify users about session end
        String message = "Session with ID " + sessionId + " has ended.";
        sendSseNotification(session.getUser(), session.getListener().getUser(), message);
        sendSseNotification(session.getListener().getUser(), session.getUser(), message);

        log.info("Session ended - Session ID: {}", sessionId);
        return "Session ended successfully";
    }

    @Override
    public String getAllSessions() {
        // Implement logic to retrieve all sessions
        return "All session details";
    }
}