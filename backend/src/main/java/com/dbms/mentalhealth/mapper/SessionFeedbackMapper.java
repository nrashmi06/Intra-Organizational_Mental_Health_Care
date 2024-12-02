package com.dbms.mentalhealth.mapper;

import com.dbms.mentalhealth.dto.sessionFeedback.request.SessionFeedbackRequestDTO;
import com.dbms.mentalhealth.dto.sessionFeedback.response.SessionFeedbackResponseDTO;
import com.dbms.mentalhealth.dto.sessionFeedback.response.SessionFeedbackSummaryResponseDTO;
import com.dbms.mentalhealth.exception.session.SessionNotFoundException;
import com.dbms.mentalhealth.exception.user.UserNotFoundException;
import com.dbms.mentalhealth.model.Session;
import com.dbms.mentalhealth.model.SessionFeedback;
import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.repository.SessionRepository;
import com.dbms.mentalhealth.repository.UserRepository;
import org.springframework.stereotype.Component;

@Component
public class SessionFeedbackMapper {

    private final UserRepository userRepository;
    private final SessionRepository sessionRepository;

    public SessionFeedbackMapper(UserRepository userRepository, SessionRepository sessionRepository) {
        this.userRepository = userRepository;
        this.sessionRepository = sessionRepository;
    }

    public SessionFeedback toEntity(SessionFeedbackRequestDTO dto) {
        SessionFeedback sessionFeedback = new SessionFeedback();
        Session session = sessionRepository.findById(dto.getSessionId())
                .orElseThrow(() -> new SessionNotFoundException("Session with id " + dto.getSessionId() + " not found"));
        sessionFeedback.setSession(session);
        sessionFeedback.setUser(session.getUser());
        sessionFeedback.setListener(session.getListener());
        sessionFeedback.setRating(dto.getRating());
        sessionFeedback.setComments(dto.getComments());
        return sessionFeedback;
    }

    public SessionFeedbackResponseDTO toResponseDTO(SessionFeedback entity) {
        SessionFeedbackResponseDTO dto = new SessionFeedbackResponseDTO();
        dto.setFeedbackId(entity.getFeedbackId());
        dto.setSessionId(entity.getSession().getSessionId());
        dto.setUserId(entity.getUser().getUserId());
        dto.setRating(entity.getRating());
        dto.setComments(entity.getComments());
        dto.setSubmittedAt(entity.getSubmittedAt());
        return dto;
    }
}