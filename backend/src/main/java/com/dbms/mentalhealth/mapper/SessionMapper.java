package com.dbms.mentalhealth.mapper;

import com.dbms.mentalhealth.dto.session.SessionResponseDTO;
import com.dbms.mentalhealth.dto.session.SessionSummaryDTO;
import com.dbms.mentalhealth.model.Session;

public class SessionMapper {
    public static SessionResponseDTO toSessionResponseDTO(Session session) {
        SessionResponseDTO dto = new SessionResponseDTO();
        dto.setSessionId(session.getSessionId());
        dto.setUserId(session.getUser().getUserId());
        dto.setListenerId(session.getListener().getUser().getUserId());
        dto.setSessionStatus(session.getSessionStatus().name());
        dto.setSessionStart(session.getSessionStart());
        dto.setSessionEnd(session.getSessionEnd());
        return dto;
    }

    public static SessionSummaryDTO toSessionSummaryDTO(Session session) {
        SessionSummaryDTO dto = new SessionSummaryDTO();
        dto.setSessionId(session.getSessionId());
        dto.setUserId(session.getUser().getUserId());
        dto.setListenerId(session.getListener().getUser().getUserId());
        dto.setSessionStatus(session.getSessionStatus().name());
        return dto;
    }
}