package com.dbms.mentalhealth.config;

import com.dbms.mentalhealth.model.ChatMessage;
import com.dbms.mentalhealth.repository.ChatMessageRepository;
import com.dbms.mentalhealth.repository.SessionRepository;
import com.dbms.mentalhealth.repository.UserRepository;
import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@ServerEndpoint("/chat/{sessionId}/{username}")
@Slf4j
public class WebSocketServer {
    private static final Map<String, Map<String, Session>> chatSessions = new ConcurrentHashMap<>();


    public WebSocketServer() {
        // Default constructor for WebSocket server
    }

    @OnOpen
    public void onOpen(Session session, @PathParam("sessionId") String sessionId, @PathParam("username") String username) {
        String token = extractToken(session);
        log.info("Opening WebSocket for user: {}, sessionId: {}", username, sessionId);
        log.info("Extracted token: {}", token);

        if (token == null || !isValidToken(token)) {
            try {
                session.close(new CloseReason(CloseReason.CloseCodes.CANNOT_ACCEPT, "Invalid or missing authentication token"));
            } catch (IOException e) {
                log.error("Error closing invalid session", e);
            }
            return;
        }

        Map<String, Session> sessionsForId = chatSessions.computeIfAbsent(sessionId, k -> new ConcurrentHashMap<>());
        if (sessionsForId.size() >= 2) {
            try {
                session.close(new CloseReason(CloseReason.CloseCodes.CANNOT_ACCEPT, "Session is full"));
            } catch (IOException e) {
                log.error("Error closing full session", e);
            }
            return;
        }

        sessionsForId.put(username, session);
        broadcastMessage(sessionId, createSystemMessage(username + " has joined the chat"), null);
    }

    @OnMessage
    public void onMessage(String message, @PathParam("sessionId") String sessionId, @PathParam("username") String username) {
        log.info("Received message from {} in session {}: {}", username, sessionId, message);

        if (message == null || message.trim().isEmpty()) {
            log.warn("Empty message received from {}", username);
            return;
        }

        broadcastMessage(sessionId, username + ": " + message, username);
    }

    @OnClose
    public void onClose(Session session, @PathParam("sessionId") String sessionId, @PathParam("username") String username) {
        if (chatSessions.containsKey(sessionId)) {
            chatSessions.get(sessionId).remove(username);
            log.info("WebSocket closed for user {} in session {}", username, sessionId);
            broadcastMessage(sessionId, createSystemMessage(username + " has left the chat"), null);
            if (chatSessions.get(sessionId).isEmpty()) {
                chatSessions.remove(sessionId);
            }
        }
    }

    @OnError
    public void onError(Session session, Throwable throwable) {
        log.error("WebSocket error", throwable);
        try {
            session.close();
        } catch (IOException e) {
            log.error("Error closing session after error", e);
        }
    }

    private String extractToken(Session session) {
        String queryString = session.getQueryString();
        log.info("Full Query String: {}", queryString);

        if (queryString == null) {
            return null;
        }

        for (String param : queryString.split("&")) {
            String[] parts = param.split("=");
            if (parts.length == 2 && "token".equals(parts[0])) {
                return URLDecoder.decode(parts[1], StandardCharsets.UTF_8);
            }
        }
        return null;
    }

    private boolean isValidToken(String token) {
        return token != null && !token.isEmpty();
    }

    private void broadcastMessage(String sessionId, String message, String excludeUser) {
        Map<String, Session> sessionUsers = chatSessions.get(sessionId);
        if (sessionUsers != null) {
            sessionUsers.forEach((username, session) -> {
                if (!username.equals(excludeUser)) {
                    try {
                        session.getBasicRemote().sendText(message);
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

    public static boolean isSessionActive(String sessionId) {
        return chatSessions.containsKey(sessionId) && chatSessions.get(sessionId).size() == 2;
    }
}