package com.dbms.mentalhealth.mapper;

import com.dbms.mentalhealth.dto.session.request.SessionReportRequestDTO;
import com.dbms.mentalhealth.dto.SessionReport.SessionReportResponseDTO;
import com.dbms.mentalhealth.exception.session.SessionNotFoundException;
import com.dbms.mentalhealth.model.Session;
import com.dbms.mentalhealth.model.SessionReport;
import com.dbms.mentalhealth.repository.SessionRepository;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;

@Component
public class SessionReportMapper {

    private final SessionRepository sessionRepository;

    public SessionReportMapper(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    public SessionReport toEntity(SessionReportRequestDTO dto) {
        SessionReport sessionReport = new SessionReport();
        Session session = sessionRepository.findById(dto.getSessionId())
                .orElseThrow(() -> new SessionNotFoundException("Session with id " + dto.getSessionId() + " not found"));
        sessionReport.setSession(session);
        sessionReport.setUser(session.getUser());
        sessionReport.setListener(session.getListener());
        sessionReport.setReportContent(dto.getReportContent());
        sessionReport.setSeverityLevel(dto.getSeverityLevel());
        sessionReport.setCreatedAt(LocalDateTime.now());
        return sessionReport;
    }

    public SessionReportResponseDTO toResponseDTO(SessionReport entity) {
        SessionReportResponseDTO dto = new SessionReportResponseDTO();
        dto.setReportId(entity.getReportId());
        dto.setSessionId(entity.getSession().getSessionId());
        dto.setUserId(entity.getUser().getUserId());
        dto.setListenerId(entity.getListener().getListenerId());
        dto.setReportContent(entity.getReportContent());
        dto.setSeverityLevel(entity.getSeverityLevel());
        dto.setCreatedAt(entity.getCreatedAt());
        return dto;
    }
}