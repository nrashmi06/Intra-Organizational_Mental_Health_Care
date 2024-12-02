package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.sessionFeedback.request.SessionFeedbackRequestDTO;
import com.dbms.mentalhealth.dto.sessionFeedback.response.SessionFeedbackResponseDTO;
import com.dbms.mentalhealth.exception.listener.ListenerNotFoundException;
import com.dbms.mentalhealth.exception.session.FeedbackNotFoundException;
import com.dbms.mentalhealth.exception.session.SessionNotFoundException;
import com.dbms.mentalhealth.mapper.SessionFeedbackMapper;
import com.dbms.mentalhealth.model.Listener;
import com.dbms.mentalhealth.model.SessionFeedback;
import com.dbms.mentalhealth.repository.ListenerRepository;
import com.dbms.mentalhealth.repository.SessionFeedbackRepository;
import com.dbms.mentalhealth.service.SessionFeedbackService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class SessionFeedbackServiceImpl implements SessionFeedbackService {

    private final SessionFeedbackRepository sessionFeedbackRepository;
    private final SessionFeedbackMapper sessionFeedbackMapper;
    private final ListenerRepository listenerRepository;

    public SessionFeedbackServiceImpl(SessionFeedbackRepository sessionFeedbackRepository, SessionFeedbackMapper sessionFeedbackMapper, ListenerRepository listenerRepository) {
        this.sessionFeedbackRepository = sessionFeedbackRepository;
        this.sessionFeedbackMapper = sessionFeedbackMapper;
        this.listenerRepository = listenerRepository;
    }

    @Override
    public SessionFeedbackResponseDTO createFeedback(SessionFeedbackRequestDTO requestDTO) {
        try {
            SessionFeedback sessionFeedback = sessionFeedbackMapper.toEntity(requestDTO);
            Listener listener = sessionFeedback.getSession().getListener();

            // Calculate the new average rating
            BigDecimal currentTotalRating = listener.getAverageRating().multiply(BigDecimal.valueOf(listener.getFeedbackCount()));
            BigDecimal newTotalRating = currentTotalRating.add(BigDecimal.valueOf(sessionFeedback.getRating()));
            BigDecimal newAverageRating = newTotalRating.divide(BigDecimal.valueOf(listener.getFeedbackCount() + 1), 2, BigDecimal.ROUND_HALF_UP);

            // Update listener's average rating and feedback count
            listener.setAverageRating(newAverageRating);
            listener.setFeedbackCount(listener.getFeedbackCount() + 1);

            // Save the updated listener details
            listenerRepository.save(listener);

            sessionFeedback = sessionFeedbackRepository.save(sessionFeedback);
            return sessionFeedbackMapper.toResponseDTO(sessionFeedback);
        } catch (Exception e) {
            throw new RuntimeException("Error creating feedback", e);
        }
    }

    @Override
    public List<SessionFeedbackResponseDTO> getFeedbackBySessionId(Integer sessionId) {
        try {
            List<SessionFeedback> feedbackList = sessionFeedbackRepository.findBySession_SessionId(sessionId);
            return feedbackList.stream()
                    .map(sessionFeedbackMapper::toResponseDTO)
                    .toList();
        } catch (FeedbackNotFoundException e) {
            throw new FeedbackNotFoundException("Feedback for session with ID " + sessionId + " not found");
        }
    }

    @Override
    public SessionFeedbackResponseDTO getFeedbackById(Integer feedbackId) {
        try {
            SessionFeedback sessionFeedback = sessionFeedbackRepository.findById(feedbackId)
                    .orElseThrow(() -> new FeedbackNotFoundException("Feedback with id " + feedbackId + " not found"));
            return sessionFeedbackMapper.toResponseDTO(sessionFeedback);
        } catch (FeedbackNotFoundException e) {
            throw e;
        } catch (Exception e) {
            throw new RuntimeException("Error retrieving feedback by ID " + feedbackId, e);
        }
    }

    @Override
    public List<SessionFeedbackResponseDTO> getAllListenerFeedback(Integer listenerId) {
        try{
            List<SessionFeedback> feedbackList = sessionFeedbackRepository.findByListener_ListenerId(listenerId);
            return feedbackList.stream()
                    .map(sessionFeedbackMapper::toResponseDTO)
                    .toList();
        } catch (ListenerNotFoundException e) {
            throw new ListenerNotFoundException("Listener with ID " + listenerId + " not found");
        }
    }
}