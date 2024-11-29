package com.dbms.mentalhealth.config;

import com.dbms.mentalhealth.security.jwt.JwtUtils;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.messaging.Message;
import org.springframework.messaging.MessageChannel;
import org.springframework.messaging.simp.stomp.StompHeaderAccessor;
import org.springframework.messaging.support.ChannelInterceptor;
import org.springframework.stereotype.Component;

import java.util.Map;

@Component
@Slf4j
@RequiredArgsConstructor
public class WebSocketAuthInterceptor implements ChannelInterceptor {
    private final JwtUtils jwtUtils;

    @Override
    public Message<?> preSend(Message<?> message, MessageChannel channel) {
        StompHeaderAccessor accessor = StompHeaderAccessor.wrap(message);
        String token = extractToken(accessor);

        validateAndSetUser(token, accessor);

        return message;
    }

    private String extractToken(StompHeaderAccessor accessor) {
        String token = accessor.getFirstNativeHeader("Authorization");
        if (token == null || !token.startsWith("Bearer ")) {
            throw new IllegalArgumentException("Invalid or missing Authorization header");
        }
        return token.substring(7);
    }

    private void validateAndSetUser(String token, StompHeaderAccessor accessor) {
        if (!jwtUtils.validateJwtToken(token)) {
            log.error("Invalid JWT token");
            throw new IllegalArgumentException("Invalid JWT token");
        }

        String username = jwtUtils.getUserNameFromJwtToken(token);
        String chatSessionId = accessor.getFirstNativeHeader("ChatSessionId");

        if (chatSessionId == null) {
            throw new IllegalArgumentException("Chat Session ID is required");
        }

        accessor.setUser(() -> username);
        accessor.setSessionAttributes(Map.of(
                "username", username,
                "chatSessionId", chatSessionId
        ));
    }
}