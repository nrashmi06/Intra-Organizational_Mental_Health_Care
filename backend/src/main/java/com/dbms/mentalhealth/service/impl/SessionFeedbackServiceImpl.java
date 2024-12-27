package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.sessionFeedback.request.SessionFeedbackRequestDTO;
import com.dbms.mentalhealth.dto.sessionFeedback.response.SessionFeedbackResponseDTO;
import com.dbms.mentalhealth.dto.sessionFeedback.response.SessionFeedbackSummaryResponseDTO;
import com.dbms.mentalhealth.exception.listener.ListenerNotFoundException;
import com.dbms.mentalhealth.exception.session.FeedbackNotFoundException;
import org.springframework.transaction.annotation.Transactional;
import com.dbms.mentalhealth.mapper.SessionFeedbackMapper;
import com.dbms.mentalhealth.model.Listener;
import com.dbms.mentalhealth.model.SessionFeedback;
import com.dbms.mentalhealth.repository.ListenerRepository;
import com.dbms.mentalhealth.repository.SessionFeedbackRepository;
import com.dbms.mentalhealth.service.SessionFeedbackService;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
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
    @Transactional
    public SessionFeedbackResponseDTO createFeedback(SessionFeedbackRequestDTO requestDTO) {
        SessionFeedback sessionFeedback = sessionFeedbackMapper.toEntity(requestDTO);
        Listener listener = sessionFeedback.getSession().getListener();

        if (listener == null) {
            throw new ListenerNotFoundException("Listener not found for the session");
        }

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
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionFeedbackResponseDTO> getFeedbackBySessionId(Integer sessionId) {
        List<SessionFeedback> feedbackList = sessionFeedbackRepository.findBySession_SessionId(sessionId);
        if (feedbackList.isEmpty()) {
            throw new FeedbackNotFoundException("Feedback for session with ID " + sessionId + " not found");
        }
        return feedbackList.stream()
                .map(sessionFeedbackMapper::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SessionFeedbackResponseDTO getFeedbackById(Integer feedbackId) {
        SessionFeedback sessionFeedback = sessionFeedbackRepository.findById(feedbackId)
                .orElseThrow(() -> new FeedbackNotFoundException("Feedback with id " + feedbackId + " not found"));
        return sessionFeedbackMapper.toResponseDTO(sessionFeedback);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionFeedbackResponseDTO> getAllListenerFeedback(Integer id, String type) {
        Listener listener;
        if (!type.equals("listenerId")) {
            listener = listenerRepository.findByUser_UserId(id)
                    .orElseThrow(() -> new ListenerNotFoundException("Listener with email " + type + " not found"));
        } else {
            listener = listenerRepository.findById(id)
                    .orElseThrow(() -> new ListenerNotFoundException("Listener with ID " + id + " not found"));
        }
        List<SessionFeedback> feedbackList = sessionFeedbackRepository.findByListener_ListenerId(listener.getListenerId());
        if (feedbackList.isEmpty()) {
            throw new ListenerNotFoundException("Listener with ID " + listener.getListenerId() + " not found");
        }
        return feedbackList.stream()
                .map(sessionFeedbackMapper::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SessionFeedbackSummaryResponseDTO getFeedbackSummary() {
        List<SessionFeedback> feedbacks = sessionFeedbackRepository.findAll();
        if (feedbacks.isEmpty()) {
            throw new FeedbackNotFoundException("No feedback found");
        }

        BigDecimal avgRating = feedbacks.stream()
                .map(SessionFeedback::getRating)
                .map(BigDecimal::valueOf)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(feedbacks.size()), 2, BigDecimal.ROUND_HALF_UP);

        Map<Integer, Long> feedbacksByRating = feedbacks.stream()
                .collect(Collectors.groupingBy(SessionFeedback::getRating, Collectors.counting()));

        return new SessionFeedbackSummaryResponseDTO(
                avgRating,
                feedbacksByRating.getOrDefault(5, 0L).intValue(),
                feedbacksByRating.getOrDefault(4, 0L).intValue(),
                feedbacksByRating.getOrDefault(3, 0L).intValue(),
                feedbacksByRating.getOrDefault(2, 0L).intValue(),
                feedbacksByRating.getOrDefault(1, 0L).intValue()
        );
    }
}