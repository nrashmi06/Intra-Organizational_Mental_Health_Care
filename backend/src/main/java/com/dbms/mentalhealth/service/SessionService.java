package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.dto.chatMessage.ChatMessageDTO;
import com.dbms.mentalhealth.dto.session.response.SessionResponseDTO;
import com.dbms.mentalhealth.dto.session.response.SessionSummaryDTO;
import com.fasterxml.jackson.core.JsonProcessingException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface SessionService {
    String initiateSession(Integer listenerId, String message) throws JsonProcessingException;
    String updateSessionStatus(Integer userId, String action);
    SessionResponseDTO getSessionById(Integer sessionId);
    String endSession(Integer sessionId);
    List<ChatMessageDTO> getMessagesBySessionId(Integer sessionId);
    String getAverageSessionDuration();
    List<SessionSummaryDTO> broadcastFullSessionCache();
    public boolean isUserInSession(Integer userId);
    Page<SessionSummaryDTO> getSessionsByFilters(String status, Integer id, String idType, Pageable pageable);


}