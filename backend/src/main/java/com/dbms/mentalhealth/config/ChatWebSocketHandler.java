// ChatWebSocketHandler.java
package com.dbms.mentalhealth.config;

import com.dbms.mentalhealth.model.ChatMessage;
import com.dbms.mentalhealth.model.Session;
import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.repository.SessionRepository;
import com.dbms.mentalhealth.repository.UserRepository;
import com.dbms.mentalhealth.service.ChatMessageService;
import com.dbms.mentalhealth.service.UserService;
import com.dbms.mentalhealth.service.ListenerService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.CloseStatus;
import org.springframework.web.socket.TextMessage;
import org.springframework.web.socket.WebSocketSession;
import org.springframework.web.socket.handler.TextWebSocketHandler;

import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Slf4j
@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private final SessionRepository sessionRepository;
    private final UserService userService;
    private final ListenerService listenerService;
    private final ChatMessageService chatMessageService;

    private static final Map<String, Map<String, WebSocketSession>> chatSessions = new ConcurrentHashMap<>();
    private final UserRepository userRepository;

    public ChatWebSocketHandler(SessionRepository sessionRepository, UserService userService, ListenerService listenerService, ChatMessageService chatMessageService, UserRepository userRepository) {
        this.sessionRepository = sessionRepository;
        this.userService = userService;
        this.listenerService = listenerService;
        this.chatMessageService = chatMessageService;
        this.userRepository = userRepository;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String sessionId = getPathParam(session, "sessionId");
        String username = getPathParam(session, "username");

        log.info("WebSocket connection established for user: {}, sessionId: {}", username, sessionId);

        Map<String, WebSocketSession> sessionsForId = chatSessions.computeIfAbsent(sessionId, k -> new ConcurrentHashMap<>());
        if (sessionsForId.size() >= 2) {
            session.close(CloseStatus.NOT_ACCEPTABLE.withReason("Session is full"));
            return;
        }

        sessionsForId.put(username, session);
        broadcastMessage(sessionId, createSystemMessage(username + " has joined the chat"), null);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            String sessionId = getPathParam(session, "sessionId");
            String username = getPathParam(session, "username");

            log.info("Received message from {} in session {}: {}", username, sessionId, message.getPayload());

            if (message.getPayload().trim().isEmpty()) {
                log.warn("Empty message received from {}", username);
                return;
            }

            // Validate sessionId and username
            if (sessionId == null || username == null) {
                log.error("Invalid session parameters: sessionId={}, username={}", sessionId, username);
                return;
            }

            int parsedSessionId;
            try {
                parsedSessionId = Integer.parseInt(sessionId);
            } catch (NumberFormatException e) {
                log.error("Invalid session ID format: {}", sessionId);
                return;
            }

            // Find session and user with null checks
            Session foundSession = sessionRepository.findById(parsedSessionId)
                    .orElse(null);
            User sender = userRepository.findByAnonymousName(username);

            if (foundSession == null) {
                log.error("Session not found for ID: {}", parsedSessionId);
                return;
            }

            if (sender == null) {
                log.error("User not found with username: {}", username);
                return;
            }

            // Create and save chat message
            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setSession(foundSession);
            chatMessage.setSender(sender);
            chatMessage.setMessageContent(message.getPayload());
            chatMessage.setSentAt(LocalDateTime.now());

            chatMessageService.saveMessage(chatMessage);

            listenerService.incrementMessageCount(username);

            // Broadcast the message
            broadcastMessage(sessionId, username + ": " + message.getPayload(), username);

        } catch (Exception e) {
            log.error("Error processing WebSocket message", e);
            // Optionally, you might want to send an error response back to the client
            // sendErrorToClient(session, "Failed to process message");
        }
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        String sessionId = getPathParam(session, "sessionId");
        String username = getPathParam(session, "username");

        Map<String, WebSocketSession> sessionsForId = chatSessions.get(sessionId);
        if (sessionsForId != null) {
            sessionsForId.remove(username);
            log.info("WebSocket closed for user {} in session {}", username, sessionId);

            if (sessionsForId.isEmpty()) {
                chatSessions.remove(sessionId);
            } else {
                broadcastMessage(sessionId, createSystemMessage(username + " has left the chat"), null);
            }
        }
    }

    private String getPathParam(WebSocketSession session, String paramName) {
        String path = session.getUri().getPath();
        String[] pathParts = path.split("/");
        if ("sessionId".equals(paramName)) {
            return pathParts[pathParts.length - 2];
        } else if ("username".equals(paramName)) {
            return pathParts[pathParts.length - 1];
        }
        return null;
    }

    private void broadcastMessage(String sessionId, String message, String excludeUser) {
        Map<String, WebSocketSession> sessionsForId = chatSessions.get(sessionId);
        if (sessionsForId != null) {
            sessionsForId.forEach((username, wsSession) -> {
                if (!username.equals(excludeUser) && wsSession.isOpen()) {
                    try {
                        wsSession.sendMessage(new TextMessage(message));
                    } catch (IOException e) {
                        log.error("Error broadcasting message", e);
                    }
                }
            });
        }
    }

    private String createSystemMessage(String content) {
        return "SYSTEM: " + content;
    }
}