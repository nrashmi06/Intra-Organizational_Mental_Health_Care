package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.config.WebSocketServer;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/chat")
public class ChatSessionController {
    @GetMapping("/check-session/{sessionId}")
    public ResponseEntity<Boolean> checkSessionStatus(@PathVariable String sessionId) {
        return ResponseEntity.ok(WebSocketServer.isSessionActive(sessionId));
    }
}