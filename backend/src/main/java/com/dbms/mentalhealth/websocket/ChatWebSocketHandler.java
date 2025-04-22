package com.dbms.mentalhealth.websocket;

import com.dbms.mentalhealth.model.ChatMessage;
import com.dbms.mentalhealth.model.ModerationResult;
import com.dbms.mentalhealth.model.Session;
import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.repository.SessionRepository;
import com.dbms.mentalhealth.repository.UserRepository;
import com.dbms.mentalhealth.scheduler.ChatMessageScheduler;
import com.dbms.mentalhealth.service.ChatMessageService;
import com.dbms.mentalhealth.service.GeminiService;
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
    private final UserRepository userRepository;
    private final ChatMessageScheduler chatMessageScheduler;
    private final GeminiService geminiService;

    private static final Map<String, Map<String, WebSocketSession>> chatSessions = new ConcurrentHashMap<>();
    private final Map<String, Session> sessionCache = new ConcurrentHashMap<>();
    private final Map<String, User> userCache = new ConcurrentHashMap<>();

    public ChatWebSocketHandler(SessionRepository sessionRepository,
                                UserRepository userRepository,
                                ChatMessageScheduler chatMessageScheduler,
                                GeminiService geminiService) {
        this.sessionRepository = sessionRepository;
        this.userRepository = userRepository;
        this.chatMessageScheduler = chatMessageScheduler;
        this.geminiService = geminiService;
    }

    @Override
    public void afterConnectionEstablished(WebSocketSession session) throws Exception {
        String sessionId = getPathParam(session, "sessionId");
        String username = getPathParam(session, "username");

        log.info("WebSocket connection established for user: {}, sessionId: {}", username, sessionId);

        Map<String, WebSocketSession> sessionsForId = chatSessions.computeIfAbsent(sessionId, k -> new ConcurrentHashMap<>());
        if (sessionsForId.size() >= 2) {
            log.warn("Session {} is full. Closing connection for user: {}", sessionId, username);
            session.close(CloseStatus.NOT_ACCEPTABLE.withReason("Session is full"));
            return;
        }

        sessionsForId.put(username, session);
        log.info("User {} added to session {}", username, sessionId);
        broadcastMessage(sessionId, createSystemMessage(username + " has joined the chat"), null);
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        try {
            String sessionId = getPathParam(session, "sessionId");
            String username = getPathParam(session, "username");

            if (!isValidMessage(message, sessionId, username)) {
                return;
            }

            Session chatSession = getSessionFromCache(sessionId);
            User sender = getUserFromCache(username);

            if (chatSession == null || sender == null) {
                log.error("Session or user not found in cache");
                return;
            }

            String messageContent = message.getPayload();

            // Moderate the message using Gemini API
            ModerationResult moderationResult = geminiService.moderateMessage(messageContent);

            if (!moderationResult.isAllowed()) {
                log.warn("Message from user {} in session {} was blocked by moderation. Reason: {}",
                        username, sessionId, moderationResult.getReason());

                // Send notification back to the sender that their message was blocked
                sendModerationNotification(session, moderationResult.getReason());
                return;
            }

            ChatMessage chatMessage = new ChatMessage();
            chatMessage.setSession(chatSession);
            chatMessage.setSender(sender);
            chatMessage.setMessageContent(messageContent);
            chatMessage.setSentAt(LocalDateTime.now());

            chatMessageScheduler.queueMessage(chatMessage, username);

            log.info("Queued message from {} in session {}: {}", username, sessionId, messageContent);
            broadcastMessage(sessionId, username + ": " + messageContent, username);

        } catch (Exception e) {
            log.error("Error processing WebSocket message", e);
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
                sessionCache.remove(sessionId);
                log.info("Session {} removed from chatSessions", sessionId);
            } else {
                broadcastMessage(sessionId, createSystemMessage(username + " has left the chat"), null);
            }
        }
    }

    private void sendModerationNotification(WebSocketSession session, String reason) {
        try {
            String notification = createSystemMessage("Your message was not sent due to content policy violation: " + reason);
            session.sendMessage(new TextMessage(notification));
        } catch (IOException e) {
            log.error("Error sending moderation notification", e);
        }
    }

    private Session getSessionFromCache(String sessionId) {
        return sessionCache.computeIfAbsent(sessionId, id -> {
            try {
                return sessionRepository.findById(Integer.parseInt(id)).orElse(null);
            } catch (NumberFormatException e) {
                log.error("Invalid session ID format: {}", id);
                return null;
            }
        });
    }

    private User getUserFromCache(String username) {
        return userCache.computeIfAbsent(username,
                name -> userRepository.findByAnonymousName(name));
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

    private boolean isValidMessage(TextMessage message, String sessionId, String username) {
        if (message.getPayload().trim().isEmpty()) {
            log.warn("Empty message received from {}", username);
            return false;
        }

        if (sessionId == null || username == null) {
            log.error("Invalid session parameters: sessionId={}, username={}", sessionId, username);
            return false;
        }

        return true;
    }

    private void broadcastMessage(String sessionId, String message, String excludeUser) {
        Map<String, WebSocketSession> sessionsForId = chatSessions.get(sessionId);
        if (sessionsForId != null) {
            sessionsForId.forEach((username, wsSession) -> {
                if (!username.equals(excludeUser) && wsSession.isOpen()) {
                    synchronized (wsSession) {
                        try {
                            wsSession.sendMessage(new TextMessage(message));
                            log.info("Broadcasted message to user {} in session {}", username, sessionId);
                        } catch (IOException e) {
                            log.error("Error broadcasting message to user {} in session {}", username, sessionId, e);
                        }
                    }
                }
            });
        }
    }

    public boolean endSession(String sessionId) {
        Map<String, WebSocketSession> sessionsForId = chatSessions.remove(sessionId);
        if (sessionsForId != null) {
            sessionsForId.forEach((username, wsSession) -> {
                if (wsSession.isOpen()) {
                    try {
                        wsSession.close(CloseStatus.NORMAL);
                        log.info("Closed WebSocket session for user {} in session {}", username, sessionId);
                    } catch (IOException e) {
                        log.error("Error closing WebSocket session for user {} in session {}", username, sessionId, e);
                    }
                }
            });
            sessionCache.remove(sessionId);
            log.info("Session {} ended and removed from chatSessions", sessionId);
            return true;
        } else {
            log.warn("Session {} not found in chatSessions", sessionId);
            return false;
        }
    }

    private String createSystemMessage(String content) {
        return "SYSTEM: " + content;
    }
}