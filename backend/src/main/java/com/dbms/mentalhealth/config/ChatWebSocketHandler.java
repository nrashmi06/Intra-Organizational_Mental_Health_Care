package com.dbms.mentalhealth.handler;

import com.dbms.mentalhealth.model.ChatMessage;
import com.dbms.mentalhealth.repository.ChatMessageRepository;
import com.dbms.mentalhealth.repository.SessionRepository;
import com.dbms.mentalhealth.repository.UserRepository;
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
    private final UserRepository userRepository;
    private final ChatMessageRepository chatMessageRepository;

    private static final Map<String, Map<String, WebSocketSession>> chatSessions = new ConcurrentHashMap<>();

    public ChatWebSocketHandler(SessionRepository sessionRepository, UserRepository userRepository, ChatMessageRepository chatMessageRepository) {
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
        this.chatMessageRepository = chatMessageRepository;
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
        String sessionId = getPathParam(session, "sessionId");
        String username = getPathParam(session, "username");

        log.info("Received message from {} in session {}: {}", username, sessionId, message.getPayload());

        if (message.getPayload().trim().isEmpty()) {
            log.warn("Empty message received from {}", username);
            return;
        }

        // Save chat message to the database
        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setSession(sessionRepository.findById(Integer.parseInt(sessionId))
                .orElseThrow(() -> new IllegalStateException("Session not found")));
        chatMessage.setSender(userRepository.findByAnonymousName(username));
        chatMessage.setMessageContent(message.getPayload());
        chatMessage.setSentAt(LocalDateTime.now());
        chatMessageRepository.save(chatMessage);

        // Broadcast the message
        broadcastMessage(sessionId, username + ": " + message.getPayload(), username);
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
