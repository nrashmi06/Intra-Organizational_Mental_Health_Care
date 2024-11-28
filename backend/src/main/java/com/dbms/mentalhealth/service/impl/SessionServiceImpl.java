package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.enums.SessionStatus;
import com.dbms.mentalhealth.model.Listener;
import com.dbms.mentalhealth.model.Notification;
import com.dbms.mentalhealth.model.Session;
import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.repository.ListenerRepository;
import com.dbms.mentalhealth.repository.SessionRepository;
import com.dbms.mentalhealth.repository.UserRepository;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.NotificationService;
import com.dbms.mentalhealth.service.SessionService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class SessionServiceImpl implements SessionService {

    private final NotificationService notificationService;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final ListenerRepository listenerRepository;
    private final SessionRepository sessionRepository;

    @Autowired
    public SessionServiceImpl(NotificationService notificationService, JwtUtils jwtUtils, UserRepository userRepository, ListenerRepository listenerRepository, SessionRepository sessionRepository) {
        this.notificationService = notificationService;
        this.jwtUtils = jwtUtils;
        this.userRepository = userRepository;
        this.listenerRepository = listenerRepository;
        this.sessionRepository = sessionRepository;
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
            return "Invalid sender or receiver";
        }

        Session session = new Session();
        session.setListener(listenerRepository.findByUser_UserId(listenerId)
                .orElseThrow(() -> new IllegalStateException("Listener not found")));
        session.setUser(sender);
        session.setSessionStatus(SessionStatus.INITIATED);
        session.setSessionStart(LocalDateTime.now());

        // Ensure sessionEnd is set appropriately if required by the constraint
        if (session.getSessionStatus() == SessionStatus.INITIATED) {
            session.setSessionEnd(null); // or set to a valid value if required
        }

        sessionRepository.save(session);

        Notification notification = new Notification();
        notification.setMessage(message);
        notification.setReceiver(receiver);
        notification.setSender(sender);
        notificationService.sendNotification(notification);

        return "Session request sent to listener";
    }

    @Override
    public String updateSessionStatus(Integer userId, String action) {
        Integer listenerId = jwtUtils.getUserIdFromContext();
        Listener listener = listenerRepository.findByUser_UserId(listenerId)
                .orElseThrow(() -> new IllegalStateException("Listener not found"));

        Session session = sessionRepository.findByUser_UserIdAndListener_ListenerId(userId, listener.getListenerId())
                .orElseThrow(() -> new IllegalStateException("Session not found"));

        if ("accept".equalsIgnoreCase(action)) {
            session.setSessionStatus(SessionStatus.ONGOING);
        } else if ("reject".equalsIgnoreCase(action)) {
            session.setSessionStatus(SessionStatus.CANCELLED);
        } else {
            return "Invalid action";
        }

        sessionRepository.save(session);

        Notification notification = new Notification();
        notification.setMessage("Your session request has been " + action + "ed by listener " +
                userRepository.findById(listenerId)
                        .orElseThrow(() -> new IllegalStateException("Listener not found"))
                        .getAnonymousName());
        notification.setReceiver(session.getUser());
        notification.setSender(session.getListener().getUser());
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