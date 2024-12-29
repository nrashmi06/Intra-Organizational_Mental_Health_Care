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
import java.util.Set;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.locks.ReentrantLock;

@Slf4j
@Component
public class ChatWebSocketHandler extends TextWebSocketHandler {

    private static final int MAX_PARTICIPANTS = 2;
    private final SessionRepository sessionRepository;
    private final UserService userService;
    private final ListenerService listenerService;
    private final ChatMessageService chatMessageService;
    private final UserRepository userRepository;

    // Thread-safe session management with locks
    private static final Map<String, ChatRoom> chatRooms = new ConcurrentHashMap<>();
    private static final Map<String, ReentrantLock> sessionLocks = new ConcurrentHashMap<>();

    private static class ChatRoom {
        private final Map<String, WebSocketSession> participants;
        private final Set<String> authorizedUsers;
        private final String sessionId;
        private boolean isActive;

        public ChatRoom(String sessionId) {
            this.sessionId = sessionId;
            this.participants = new ConcurrentHashMap<>();
            this.authorizedUsers = ConcurrentHashMap.newKeySet();
            this.isActive = true;
        }

        public boolean canJoin(String username) {
            return isActive &&
                    participants.size() < MAX_PARTICIPANTS &&
                    (participants.isEmpty() || authorizedUsers.contains(username));
        }

        public void addAuthorizedUser(String username) {
            authorizedUsers.add(username);
        }

        public boolean isParticipant(String username) {
            return participants.containsKey(username);
        }
    }

    public ChatWebSocketHandler(SessionRepository sessionRepository,
                                UserService userService,
                                ListenerService listenerService,
                                ChatMessageService chatMessageService,
                                UserRepository userRepository) {
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

        ReentrantLock sessionLock = sessionLocks.computeIfAbsent(sessionId, k -> new ReentrantLock());
        sessionLock.lock();
        try {
            ChatRoom chatRoom = chatRooms.computeIfAbsent(sessionId, ChatRoom::new);

            if (!chatRoom.canJoin(username)) {
                log.warn("Access denied for user: {} to session: {}", username, sessionId);
                session.close(CloseStatus.NOT_ACCEPTABLE.withReason("Access denied"));
                return;
            }

            if (chatRoom.participants.isEmpty()) {
                chatRoom.addAuthorizedUser(username);
            }

            chatRoom.participants.put(username, session);
            log.info("User {} joined session {}", username, sessionId);
            broadcastMessage(chatRoom, createSystemMessage(username + " has joined the chat"), null);
        } finally {
            sessionLock.unlock();
        }
    }

    @Override
    protected void handleTextMessage(WebSocketSession session, TextMessage message) throws Exception {
        String sessionId = getPathParam(session, "sessionId");
        String username = getPathParam(session, "username");
        ChatRoom chatRoom = chatRooms.get(sessionId);

        if (chatRoom == null || !chatRoom.isParticipant(username)) {
            log.error("Unauthorized message attempt from user: {} in session: {}", username, sessionId);
            session.close(CloseStatus.POLICY_VIOLATION);
            return;
        }

        try {
            processAndBroadcastMessage(sessionId, username, message.getPayload(), chatRoom);
        } catch (Exception e) {
            log.error("Error processing message", e);
            session.close(CloseStatus.SERVER_ERROR);
        }
    }

    private void processAndBroadcastMessage(String sessionId, String username, String content, ChatRoom chatRoom) {
        if (content.trim().isEmpty()) {
            return;
        }

        Session dbSession = sessionRepository.findById(Integer.parseInt(sessionId))
                .orElseThrow(() -> new IllegalStateException("Session not found: " + sessionId));
        User sender = userRepository.findByAnonymousName(username);

        ChatMessage chatMessage = new ChatMessage();
        chatMessage.setSession(dbSession);
        chatMessage.setSender(sender);
        chatMessage.setMessageContent(content);
        chatMessage.setSentAt(LocalDateTime.now());

        chatMessageService.saveMessage(chatMessage);
        listenerService.incrementMessageCount(username);
        broadcastMessage(chatRoom, username + ": " + content, username);
    }

    @Override
    public void afterConnectionClosed(WebSocketSession session, CloseStatus status) {
        String sessionId = getPathParam(session, "sessionId");
        String username = getPathParam(session, "username");

        ReentrantLock sessionLock = sessionLocks.get(sessionId);
        if (sessionLock != null) {
            sessionLock.lock();
            try {
                ChatRoom chatRoom = chatRooms.get(sessionId);
                if (chatRoom != null && chatRoom.isParticipant(username)) {
                    chatRoom.participants.remove(username);
                    if (chatRoom.participants.isEmpty()) {
                        chatRooms.remove(sessionId);
                        sessionLocks.remove(sessionId);
                    } else {
                        broadcastMessage(chatRoom, createSystemMessage(username + " has left the chat"), null);
                    }
                }
            } finally {
                sessionLock.unlock();
            }
        }
    }

    public boolean endSession(String sessionId) {
        ReentrantLock sessionLock = sessionLocks.get(sessionId);
        if (sessionLock != null) {
            sessionLock.lock();
            try {
                ChatRoom chatRoom = chatRooms.remove(sessionId);
                if (chatRoom != null) {
                    chatRoom.isActive = false;
                    chatRoom.participants.forEach((username, wsSession) -> {
                        try {
                            wsSession.close(CloseStatus.NORMAL);
                        } catch (IOException e) {
                            log.error("Error closing session for user: " + username, e);
                        }
                    });
                    return true;
                }
            } finally {
                sessionLock.unlock();
                sessionLocks.remove(sessionId);
            }
        }
        return false;
    }

    private void broadcastMessage(ChatRoom chatRoom, String message, String excludeUser) {
        chatRoom.participants.forEach((username, wsSession) -> {
            if (!username.equals(excludeUser) && wsSession.isOpen()) {
                synchronized (wsSession) {
                    try {
                        wsSession.sendMessage(new TextMessage(message));
                    } catch (IOException | IllegalStateException e) {
                        log.error("Error broadcasting to user: " + username, e);
                    }
                }
            }
        });
    }

    private String getPathParam(WebSocketSession session, String paramName) {
        String path = session.getUri().getPath();
        String[] pathParts = path.split("/");
        return "sessionId".equals(paramName) ? pathParts[pathParts.length - 2] :
                "username".equals(paramName) ? pathParts[pathParts.length - 1] : null;
    }

    private String createSystemMessage(String content) {
        return "SYSTEM: " + content;
    }
}