package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.dto.session.SessionResponseDTO;
import com.dbms.mentalhealth.dto.session.SessionSummaryDTO;

import java.util.List;

public interface SessionService {
    String getActiveSessions();
    String initiateSession(Integer listenerId, String message);
    String updateSessionStatus(Integer userId, String action);
    SessionResponseDTO getSessionById(Integer sessionId);
    String getAllSessions();
    String endSession(Integer sessionId);
    List<SessionSummaryDTO> getSessionsByUserIdOrListenerId(Integer userId, String role);
    List<SessionSummaryDTO> getSessionsByStatus(String status);
}