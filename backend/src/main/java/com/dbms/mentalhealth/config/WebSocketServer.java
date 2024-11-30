package com.dbms.mentalhealth.config;

import jakarta.websocket.*;
import jakarta.websocket.server.PathParam;
import jakarta.websocket.server.ServerEndpoint;
import lombok.extern.slf4j.Slf4j;
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
    // Concurrent map to store active chat sessions
    private static final Map<String, Map<String, Session>> chatSessions = new ConcurrentHashMap<>();

    @OnOpen
    public void onOpen(Session session,
                       @PathParam("sessionId") String sessionId,
                       @PathParam("username") String username) {
        // Extract token from query parameters
        String token = extractToken(session);
        log.info("Opening WebSocket for user: {}, sessionId: {}", username, sessionId);
        log.info("Extracted token: {}", token);

        // Validate token (replace with actual token validation logic)
        if (token == null || !isValidToken(token)) {
            try {
                session.close(new CloseReason(
                        CloseReason.CloseCodes.CANNOT_ACCEPT,
                        "Invalid or missing authentication token"
                ));
            } catch (IOException e) {
                log.error("Error closing invalid session", e);
            }
            return;
        }

        // Manage session users
        Map<String, Session> sessionsForId = chatSessions
                .computeIfAbsent(sessionId, k -> new ConcurrentHashMap<>());

        // Limit to 2 users per session
        if (sessionsForId.size() >= 2) {
            try {
                session.close(new CloseReason(
                        CloseReason.CloseCodes.CANNOT_ACCEPT,
                        "Session is full"
                ));
            } catch (IOException e) {
                log.error("Error closing full session", e);
            }
            return;
        }

        // Add user to session
        sessionsForId.put(username, session);

        // Broadcast join message
        broadcastMessage(sessionId, createSystemMessage(username + " has joined the chat"));
    }

    @OnMessage
    public void onMessage(String message,
                          @PathParam("sessionId") String sessionId,
                          @PathParam("username") String username) {
        log.info("Received message from {} in session {}: {}", username, sessionId, message);

        // Basic message validation
        if (message == null || message.trim().isEmpty()) {
            log.warn("Empty message received from {}", username);
            return;
        }

        // Broadcast message to all users in the session
        broadcastMessage(sessionId, username + ": " + message);
    }

    @OnClose
    public void onClose(Session session,
                        @PathParam("sessionId") String sessionId,
                        @PathParam("username") String username) {
        if (chatSessions.containsKey(sessionId)) {
            chatSessions.get(sessionId).remove(username);
            log.info("WebSocket closed for user {} in session {}", username, sessionId);

            // Broadcast user left message
            broadcastMessage(sessionId, createSystemMessage(username + " has left the chat"));

            // Clean up empty sessions
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

    // Extract token from query string
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

    // Token validation (replace with actual validation logic)
    private boolean isValidToken(String token) {
        // Implement actual token validation
        // This is a placeholder - replace with proper JWT validation
        return token != null && !token.isEmpty();
    }

    // Broadcast message to all users in a session
    private void broadcastMessage(String sessionId, String message) {
        Map<String, Session> sessionUsers = chatSessions.get(sessionId);
        if (sessionUsers != null) {
            sessionUsers.values().forEach(session -> {
                try {
                    session.getBasicRemote().sendText(message);
                } catch (IOException e) {
                    log.error("Error broadcasting message", e);
                }
            });
        }
    }

    // Create system message
    private String createSystemMessage(String content) {
        return "SYSTEM: " + content;
    }

    // Check if session is active
    public static boolean isSessionActive(String sessionId) {
        return chatSessions.containsKey(sessionId) &&
                chatSessions.get(sessionId).size() == 2;
    }
}