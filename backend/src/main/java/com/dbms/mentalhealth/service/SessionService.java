package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.dto.chatMessage.ChatMessageDTO;
import com.dbms.mentalhealth.dto.session.SessionResponseDTO;
import com.dbms.mentalhealth.dto.session.SessionSummaryDTO;
import com.fasterxml.jackson.core.JsonProcessingException;

import java.util.List;

public interface SessionService {
    String initiateSession(Integer listenerId, String message) throws JsonProcessingException;
    String updateSessionStatus(Integer userId, String action);
    SessionResponseDTO getSessionById(Integer sessionId);
    List<SessionSummaryDTO> getAllSessions();
    String endSession(Integer sessionId);
    List<SessionSummaryDTO> getSessionsByUserIdOrListenerId(Integer userId, String role);
    List<SessionSummaryDTO> getSessionsByStatus(String status);
    List<ChatMessageDTO> getMessagesBySessionId(Integer sessionId);
    String getAverageSessionDuration();
    List<SessionSummaryDTO> getSessionsByListenersUserId(Integer userId);
    List<SessionSummaryDTO> broadcastFullSessionCache();
}