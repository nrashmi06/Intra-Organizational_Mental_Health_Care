package com.dbms.mentalhealth.service.impl;

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
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
public class SessionServiceImpl implements SessionService {

    private final NotificationService notificationService;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final ListenerRepository listenerRepository;
    private final SessionRepository sessionRepository;
    private final NotificationRepository notificationRepository;

    @Autowired
    public SessionServiceImpl(NotificationService notificationService, JwtUtils jwtUtils, UserRepository userRepository, ListenerRepository listenerRepository, SessionRepository sessionRepository, NotificationRepository notificationRepository) {
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

            message = "Your session request has been accepted by listener " + listener.getUser().getAnonymousName() + ". Session starting soon.";
        } else if ("reject".equalsIgnoreCase(action)) {
            message = "Your session request has been rejected by listener " + listener.getUser().getAnonymousName() + ".";
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

    @Override
    public String getSessionById(Integer sessionId) {
        return "Session details for ID: " + sessionId;
    }

    @Override
    public String getAllSessions() {
        return "All session details";
    }
}