package com.dbms.mentalhealth.config;

import com.dbms.mentalhealth.security.filter.WebSocketAuthenticationFilter;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.config.annotation.EnableWebSocket;
import org.springframework.web.socket.config.annotation.WebSocketConfigurer;
import org.springframework.web.socket.config.annotation.WebSocketHandlerRegistry;
import org.springframework.web.socket.server.support.HttpSessionHandshakeInterceptor;

@Configuration
@EnableWebSocket
public class WebSocketConfig implements WebSocketConfigurer {
    @Value("${allowed.origins:*}")
    private String allowedOrigins;
    private final ChatWebSocketHandler chatWebSocketHandler;
    private final WebSocketAuthenticationFilter webSocketAuthenticationFilter;

    public WebSocketConfig(ChatWebSocketHandler chatWebSocketHandler, WebSocketAuthenticationFilter webSocketAuthenticationFilter) {
        this.chatWebSocketHandler = chatWebSocketHandler;
        this.webSocketAuthenticationFilter = webSocketAuthenticationFilter;
    }

    @Override
    public void registerWebSocketHandlers(WebSocketHandlerRegistry registry) {
        registry.addHandler(chatWebSocketHandler, "/chat/{sessionId}/{username}")
                .addInterceptors(new HttpSessionHandshakeInterceptor())
                .setAllowedOrigins(allowedOrigins);
    }
}