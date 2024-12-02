package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.dto.chatMessage.ChatMessageDTO;
import com.dbms.mentalhealth.dto.session.SessionResponseDTO;
import com.dbms.mentalhealth.dto.session.SessionSummaryDTO;

import java.util.List;

public interface SessionService {
    String initiateSession(Integer listenerId, String message);
    String updateSessionStatus(Integer userId, String action);
    SessionResponseDTO getSessionById(Integer sessionId);
    List<SessionSummaryDTO> getAllSessions();
    String endSession(Integer sessionId);
    List<SessionSummaryDTO> getSessionsByUserIdOrListenerId(Integer userId, String role);
    List<SessionSummaryDTO> getSessionsByStatus(String status);
    List<ChatMessageDTO> getMessagesBySessionId(Integer sessionId);
}