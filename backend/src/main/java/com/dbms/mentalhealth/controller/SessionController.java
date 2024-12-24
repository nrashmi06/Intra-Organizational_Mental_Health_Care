package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.config.ChatWebSocketHandler;
import com.dbms.mentalhealth.dto.chatMessage.ChatMessageDTO;
import com.dbms.mentalhealth.dto.session.SessionResponseDTO;
import com.dbms.mentalhealth.dto.session.SessionSummaryDTO;
import com.dbms.mentalhealth.service.SessionService;
import com.dbms.mentalhealth.urlMapper.SessionUrlMapping;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class SessionController {

    private final SessionService sessionService;
    private final ChatWebSocketHandler chatWebSocketHandler;

    @Autowired
    public SessionController(SessionService sessionService, ChatWebSocketHandler chatWebSocketHandler) {
        this.sessionService = sessionService;
        this.chatWebSocketHandler = chatWebSocketHandler;
    }

    @PostMapping(SessionUrlMapping.INITIATE_SESSION)
    public ResponseEntity<String> initiateSession(@PathVariable Integer listenerId, @RequestBody String message) throws JsonProcessingException {
        String sessionDetails = sessionService.initiateSession(listenerId, message);
        return ResponseEntity.ok(sessionDetails);
    }

    @PostMapping(SessionUrlMapping.UPDATE_SESSION_STATUS)
    public ResponseEntity<String> updateSessionStatus(@PathVariable Integer userId, @RequestParam String action) {
        String response = sessionService.updateSessionStatus(userId, action);
        return ResponseEntity.ok(response);
    }

    @GetMapping(SessionUrlMapping.GET_SESSION_BY_ID)
    public ResponseEntity<SessionResponseDTO> getSessionById(@PathVariable Integer sessionId) {
        SessionResponseDTO sessionResponseDTO = sessionService.getSessionById(sessionId);
        return ResponseEntity.ok(sessionResponseDTO);
    }

    @GetMapping(SessionUrlMapping.GET_ALL_SESSIONS)
    public ResponseEntity<List<SessionSummaryDTO>> getAllSessions() {
        return ResponseEntity.ok(sessionService.getAllSessions());
    }

    @PostMapping(SessionUrlMapping.END_SESSION)
    public ResponseEntity<String> endSession(@PathVariable Integer sessionId) {
        String response = sessionService.endSession(sessionId);
        chatWebSocketHandler.endSession(sessionId.toString());
        return ResponseEntity.ok(response);
    }

    @GetMapping(SessionUrlMapping.GET_SESSIONS_BY_USER_ID_OR_LISTENER_ID)
    public ResponseEntity<List<SessionSummaryDTO>> getSessionsByUserIdOrListenerId(
            @PathVariable Integer userId,
            @RequestParam String role) {
        List<SessionSummaryDTO> sessions = sessionService.getSessionsByUserIdOrListenerId(userId, role);
        return ResponseEntity.ok(sessions);
    }

    @GetMapping(SessionUrlMapping.GET_SESSIONS_BY_STATUS)
    public ResponseEntity<List<SessionSummaryDTO>> getSessionsByStatus(@RequestParam String status) {
        List<SessionSummaryDTO> sessions = sessionService.getSessionsByStatus(status);
        return ResponseEntity.ok(sessions);
    }

    @GetMapping(SessionUrlMapping.GET_MESSAGES_BY_SESSION_ID)
    public ResponseEntity<List<ChatMessageDTO>> getMessagesBySessionId(@PathVariable Integer sessionId) {
        List<ChatMessageDTO> messages = sessionService.getMessagesBySessionId(sessionId);
        return ResponseEntity.ok(messages);
    }

    @GetMapping(SessionUrlMapping.AVG_SESSION_DURATION)
    public String getAverageSessionDuration() {
        return sessionService.getAverageSessionDuration();
    }

    @GetMapping(SessionUrlMapping.GET_SESSIONS_BY_LISTENERS_USER_ID)
    public ResponseEntity<List<SessionSummaryDTO>> getSessionsByListenersUserId(@PathVariable Integer userId) {
        List<SessionSummaryDTO> sessions = sessionService.getSessionsByListenersUserId(userId);
        return ResponseEntity.ok(sessions);
    }
}