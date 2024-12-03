package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.dto.sessionFeedback.request.SessionFeedbackRequestDTO;
import com.dbms.mentalhealth.dto.sessionFeedback.response.SessionFeedbackResponseDTO;
import com.dbms.mentalhealth.dto.sessionFeedback.response.SessionFeedbackSummaryResponseDTO;

import java.util.List;

public interface SessionFeedbackService {
    SessionFeedbackResponseDTO createFeedback(SessionFeedbackRequestDTO requestDTO);
    List<SessionFeedbackResponseDTO> getFeedbackBySessionId(Integer sessionId);
    SessionFeedbackResponseDTO getFeedbackById(Integer feedbackId);
    List<SessionFeedbackResponseDTO> getAllListenerFeedback(Integer listenerId);
    SessionFeedbackSummaryResponseDTO getFeedbackSummary();
}