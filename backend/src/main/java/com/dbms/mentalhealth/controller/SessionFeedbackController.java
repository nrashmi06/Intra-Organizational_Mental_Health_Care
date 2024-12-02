package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.sessionFeedback.request.SessionFeedbackRequestDTO;
import com.dbms.mentalhealth.dto.sessionFeedback.response.SessionFeedbackResponseDTO;
import com.dbms.mentalhealth.service.SessionFeedbackService;
import com.dbms.mentalhealth.urlMapper.SessionFeedbackUrlMapping;
import com.dbms.mentalhealth.urlMapper.SessionUrlMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class SessionFeedbackController {

    private final SessionFeedbackService sessionFeedbackService;

    public SessionFeedbackController(SessionFeedbackService sessionFeedbackService) {
        this.sessionFeedbackService = sessionFeedbackService;
    }

    @PostMapping(SessionFeedbackUrlMapping.CREATE_FEEDBACK)
    public ResponseEntity<SessionFeedbackResponseDTO> createFeedback(@RequestBody SessionFeedbackRequestDTO requestDTO) {
        SessionFeedbackResponseDTO responseDTO = sessionFeedbackService.createFeedback(requestDTO);
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping(SessionFeedbackUrlMapping.GET_FEEDBACK_BY_SESSION_ID)
    public ResponseEntity<List<SessionFeedbackResponseDTO>> getFeedbackBySessionId(@PathVariable Integer sessionId) {
        List<SessionFeedbackResponseDTO> feedbackList = sessionFeedbackService.getFeedbackBySessionId(sessionId);
        return ResponseEntity.ok(feedbackList);
    }

    @GetMapping(SessionFeedbackUrlMapping.GET_FEEDBACK_BY_ID)
    public ResponseEntity<SessionFeedbackResponseDTO> getFeedbackById(@PathVariable Integer feedbackId) {
        SessionFeedbackResponseDTO responseDTO = sessionFeedbackService.getFeedbackById(feedbackId);
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping(SessionFeedbackUrlMapping.GET_ALL_LISTENER_FEEDBACK)
    public ResponseEntity<List<SessionFeedbackResponseDTO>> getAllListenerFeedback(@PathVariable Integer listenerId) {
        List<SessionFeedbackResponseDTO> feedbackList = sessionFeedbackService.getAllListenerFeedback(listenerId);
        return ResponseEntity.ok(feedbackList);
    }
}