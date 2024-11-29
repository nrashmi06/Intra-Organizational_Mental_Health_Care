package com.dbms.mentalhealth.config;

import com.dbms.mentalhealth.dto.chatMessage.ChatMessageDTO;
import com.dbms.mentalhealth.enums.MessageType;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.stereotype.Component;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketEventListener {

    private final SimpMessageSendingOperations messagingTemplate;

    @EventListener
    public void handleWebSocketConnectListener(SessionConnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String sessionId = headerAccessor.getSessionId();
        headerAccessor.addNativeHeader("server", "MyServer/1.0");
        log.info("WebSocket connection established, sessionId: {}", sessionId);
    }

    @EventListener
    public void handleWebSocketDisconnectListener(SessionDisconnectEvent event) {
        StompHeaderAccessor headerAccessor = StompHeaderAccessor.wrap(event.getMessage());
        String username = (String) headerAccessor.getSessionAttributes().get("username");
        Integer sessionId = (Integer) headerAccessor.getSessionAttributes().get("sessionId");
        if (username != null && sessionId != null) {
            log.info("User disconnected: {}", username);
            ChatMessageDTO chatMessageDTO = ChatMessageDTO.builder()
                    .type(MessageType.LEAVE)
                    .sender(username)
                    .content("User has left the chat")
                    .build();

            messagingTemplate.convertAndSend("/topic/session/" + sessionId, chatMessageDTO);
        }
    }
}