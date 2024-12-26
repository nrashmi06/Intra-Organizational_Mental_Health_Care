package com.dbms.mentalhealth.service.impl;
import com.dbms.mentalhealth.dto.chatMessage.ChatMessageDTO;
import com.dbms.mentalhealth.dto.session.SessionResponseDTO;
import com.dbms.mentalhealth.dto.session.SessionSummaryDTO;
import com.dbms.mentalhealth.enums.SessionStatus;
import com.dbms.mentalhealth.exception.listener.ListenerNotFoundException;
import com.dbms.mentalhealth.exception.session.SessionNotFoundException;
import com.dbms.mentalhealth.exception.user.UserNotFoundException;
import com.dbms.mentalhealth.mapper.ChatMessageMapper;
import com.dbms.mentalhealth.mapper.SessionMapper;
import com.dbms.mentalhealth.model.*;
import com.dbms.mentalhealth.repository.*;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.NotificationService;
import com.dbms.mentalhealth.service.SessionService;
import com.dbms.mentalhealth.service.UserActivityService;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.github.benmanes.caffeine.cache.Cache;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.annotation.Lazy;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.Duration;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@Slf4j
public class SessionServiceImpl implements SessionService {

    private final NotificationService notificationService;
    private final JwtUtils jwtUtils;
    private final UserRepository userRepository;
    private final ListenerRepository listenerRepository;
    private final SessionRepository sessionRepository;
    private final NotificationRepository notificationRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final Cache<Integer, Session> ongoingSessionsCache;
    private final UserActivityService userActivityService;

    @Autowired
    public SessionServiceImpl(NotificationService notificationService,
                              JwtUtils jwtUtils,
                              UserRepository userRepository,
                              ListenerRepository listenerRepository,
                              SessionRepository sessionRepository,
                              NotificationRepository notificationRepository,
                              ChatMessageRepository chatMessageRepository,
                              Cache<Integer, Session> ongoingSessionsCache,
                              @Lazy UserActivityService userActivityService) {
        this.notificationService = notificationService;
        this.jwtUtils = jwtUtils;
        this.userRepository = userRepository;
        this.listenerRepository = listenerRepository;
        this.sessionRepository = sessionRepository;
        this.notificationRepository = notificationRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.ongoingSessionsCache = ongoingSessionsCache;
        this.userActivityService = userActivityService;
    }


    @Override
    @Transactional
    public String initiateSession(Integer listenerId, String message) throws JsonProcessingException {
        User sender = userRepository.findById(jwtUtils.getUserIdFromContext())
                .orElseThrow(() -> new UserNotFoundException("Sender not found"));
        User receiver = userRepository.findById(listenerId)
                .orElseThrow(() -> new ListenerNotFoundException("Receiver not found"));

        // Create a notification
        ObjectMapper objectMapper = new ObjectMapper();
        JsonNode messageJson = objectMapper.readTree(message);

        Notification notification = new Notification();
        notification.setMessage(messageJson.get("message").asText() + " (User ID:" + sender.getUserId() + ")");
        notification.setReceiver(receiver);
        notification.setSender(sender);
        notificationService.sendNotification(notification);

        return "Session request sent to listener";
    }

    @Override
    @Transactional
    public String updateSessionStatus(Integer userId, String action) {
        Integer loggedInUserId = jwtUtils.getUserIdFromContext();
        Listener listener = listenerRepository.findByUser_UserId(loggedInUserId)
                .orElseThrow(() -> new ListenerNotFoundException("Listener not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));

        if ("accept".equalsIgnoreCase(action)) {
            // Create and save session
            Session session = new Session();
            session.setListener(listener);
            session.setUser(user);
            session.setSessionStatus(SessionStatus.ONGOING);
            session.setSessionStart(LocalDateTime.now());
            sessionRepository.save(session);

            ongoingSessionsCache.put(session.getSessionId(), session);

            // Broadcast session details
            broadcastFullSessionCache();

            // Prepare session notifications
            String userMessage = "Your session request has been accepted by listener " +
                    listener.getUser().getAnonymousName() +
                    ". Session starting soon. Session ID:" + session.getSessionId();
            String listenerMessage = "You have accepted a session request from user " +
                    user.getAnonymousName() +
                    ". Session starting soon. Session ID:" + session.getSessionId();

            // Send notification to both user and listener
            sendSseNotification(user, listener.getUser(), userMessage);
            sendSseNotification(listener.getUser(), user, listenerMessage);

            // Log the session details
            log.info("New session created - Session ID: {}, User: {}, Listener: {}",
                    session.getSessionId(), user.getAnonymousName(), listener.getUser().getAnonymousName());

            return "Session starting soon";
        } else if ("reject".equalsIgnoreCase(action)) {
            String userMessage = "Your session request has been rejected by listener " +
                    listener.getUser().getAnonymousName() + ".";
            // Send notification to both user and listener
            sendSseNotification(user, listener.getUser(), userMessage);

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
    @Transactional(readOnly = true)
    public SessionResponseDTO getSessionById(Integer sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new SessionNotFoundException("Session not found"));
        return SessionMapper.toSessionResponseDTO(session);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionSummaryDTO> getSessionsByUserIdOrListenerId(Integer id, String role) {
        List<Session> sessions;
        if ("listener".equalsIgnoreCase(role)) {
            Listener listener = listenerRepository.findByUser_UserId(id)
                    .orElseThrow(() -> new ListenerNotFoundException("Listener not found"));
            sessions = sessionRepository.findByListener_ListenerId(listener.getListenerId());
        } else if ("user".equalsIgnoreCase(role)) {
            sessions = sessionRepository.findByUser_UserId(id);
        } else {
            throw new IllegalArgumentException("Invalid role: " + role);
        }
        return sessions.stream()
                .map(SessionMapper::toSessionSummaryDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionSummaryDTO> getSessionsByStatus(String status) {
        List<Session> sessions = sessionRepository.findBySessionStatus(SessionStatus.valueOf(status.toUpperCase()));
        return sessions.stream()
                .map(SessionMapper::toSessionSummaryDTO)
                .toList();
    }

    @Override
    @Transactional
    public String endSession(Integer sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new SessionNotFoundException("Session not found"));

        session.setSessionStatus(SessionStatus.COMPLETED);
        session.setSessionEnd(LocalDateTime.now());
        sessionRepository.save(session);

        // Invalidate caches
        ongoingSessionsCache.invalidate(sessionId);

        // Broadcast session details
        broadcastFullSessionCache();

        // Notify users about session end
        String message = "Session with ID " + sessionId + " has ended.";
        sendSseNotification(session.getUser(), session.getListener().getUser(), message);
        sendSseNotification(session.getListener().getUser(), session.getUser(), message);

        log.info("Session ended - Session ID: {}", sessionId);
        return "Session ended successfully";
    }

    @Override
    public List<SessionSummaryDTO> broadcastFullSessionCache() {
        List<SessionSummaryDTO> cachedSessions = new ArrayList<>();
        ongoingSessionsCache.asMap().values().forEach(session -> {
            cachedSessions.add(SessionMapper.toSessionSummaryDTO(session));
        });
        userActivityService.broadcastSessionDetails(cachedSessions);
        return cachedSessions;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionSummaryDTO> getAllSessions() {
        return sessionRepository.findAll().stream()
                .map(SessionMapper::toSessionSummaryDTO)
                .toList();
    }

    @Override
    @Transactional
    public List<ChatMessageDTO> getMessagesBySessionId(Integer sessionId) {
        List<ChatMessage> messages = chatMessageRepository.findBySession_SessionId(sessionId);
        return messages.stream()
                .map(ChatMessageMapper::toChatMessageDTO)
                .toList();
    }


    @Override
    @Transactional(readOnly = true)
    public String getAverageSessionDuration() {
        long count = sessionRepository.countBySessionStatus(SessionStatus.COMPLETED);
        if (count == 0) {
            return "0m 0s";
        }

        long totalSeconds = sessionRepository.findBySessionStatus(SessionStatus.COMPLETED).stream()
                .mapToLong(session -> Duration.between(session.getSessionStart(), session.getSessionEnd()).getSeconds())
                .sum();

        long avgSeconds = totalSeconds / count;
        return String.format("%dm %ds", avgSeconds / 60, avgSeconds % 60);
    }


    @Override
    @Transactional(readOnly = true)
    public List<SessionSummaryDTO> getSessionsByListenersUserId(Integer userId) {
        Listener listener = listenerRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new ListenerNotFoundException("Listener not found"));
        List<Session> sessions = sessionRepository.findByListener_ListenerId(listener.getListenerId());
        return sessions.stream()
                .map(SessionMapper::toSessionSummaryDTO)
                .toList();
    }
}