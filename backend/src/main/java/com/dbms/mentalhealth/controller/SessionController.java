package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.service.SessionService;
import com.dbms.mentalhealth.urlMapper.SessionUrlMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
public class SessionController {

    private final SessionService sessionService;

    @Autowired
    public SessionController(SessionService sessionService) {
        this.sessionService = sessionService;
    }

    @PostMapping(SessionUrlMapping.INITIATE_SESSION)
    public ResponseEntity<String> initiateSession(@PathVariable Integer listenerId, @RequestBody String message) {
        String sessionDetails = sessionService.initiateSession(listenerId, message);
        return ResponseEntity.ok(sessionDetails);
    }

    @PostMapping(SessionUrlMapping.UPDATE_SESSION_STATUS)
    public ResponseEntity<String> updateSessionStatus(@PathVariable Integer userId, @RequestParam String action) {
        String response = sessionService.updateSessionStatus(userId, action);
        return ResponseEntity.ok(response);
    }

    @GetMapping(SessionUrlMapping.GET_SESSION_BY_ID)
    public ResponseEntity<String> getSessionById(@PathVariable Integer sessionId) {
        return ResponseEntity.ok(sessionService.getSessionById(sessionId));
    }

    @GetMapping(SessionUrlMapping.GET_ALL_SESSIONS)
    public ResponseEntity<String> getAllSessions() {
        return ResponseEntity.ok(sessionService.getAllSessions());
    }

    @PostMapping(SessionUrlMapping.END_SESSION)
    public ResponseEntity<String> endSession(@PathVariable Integer sessionId) {
        String response = sessionService.endSession(sessionId);
        return ResponseEntity.ok(response);
    }
}