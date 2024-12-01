package com.dbms.mentalhealth.config;

import com.dbms.mentalhealth.repository.ChatMessageRepository;
import com.dbms.mentalhealth.repository.SessionRepository;
import com.dbms.mentalhealth.repository.UserRepository;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.socket.server.standard.ServerEndpointExporter;

import jakarta.websocket.server.HandshakeRequest;
import jakarta.websocket.server.ServerEndpointConfig;
import jakarta.websocket.HandshakeResponse;

import java.util.Collections;

@Configuration
public class WebSocketConfig {
    @Bean
    public ServerEndpointExporter serverEndpointExporter() {
        return new ServerEndpointExporter();
    }

    @Bean
    public ServerEndpointConfig.Configurator chatEndpointConfigurator() {
        return new ChatEndpointConfigurator();
    }

    private static class ChatEndpointConfigurator extends ServerEndpointConfig.Configurator {
        @Override
        public void modifyHandshake(ServerEndpointConfig sec, HandshakeRequest request, HandshakeResponse response) {
            // Add CORS headers to WebSocket handshake response
            response.getHeaders().put("Access-Control-Allow-Origin", Collections.singletonList("*"));
            response.getHeaders().put("Access-Control-Allow-Credentials", Collections.singletonList("true"));
            response.getHeaders().put("Access-Control-Allow-Methods", Collections.singletonList("GET, POST, OPTIONS"));
            response.getHeaders().put("Access-Control-Allow-Headers", Collections.singletonList("Content-Type, Authorization"));

            super.modifyHandshake(sec, request, response);
        }
    }
}