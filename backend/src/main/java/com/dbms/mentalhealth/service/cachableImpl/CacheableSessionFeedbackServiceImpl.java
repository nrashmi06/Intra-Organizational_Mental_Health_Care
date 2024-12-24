package com.dbms.mentalhealth.service.cachableImpl;

import com.dbms.mentalhealth.dto.sessionFeedback.request.SessionFeedbackRequestDTO;
import com.dbms.mentalhealth.dto.sessionFeedback.response.SessionFeedbackResponseDTO;
import com.dbms.mentalhealth.dto.sessionFeedback.response.SessionFeedbackSummaryResponseDTO;
import com.dbms.mentalhealth.service.SessionFeedbackService;
import com.dbms.mentalhealth.service.impl.SessionFeedbackServiceImpl;
import com.github.benmanes.caffeine.cache.Cache;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Primary
public class CacheableSessionFeedbackServiceImpl implements SessionFeedbackService {

    private final SessionFeedbackServiceImpl sessionFeedbackServiceImpl;
    private final Cache<Integer, SessionFeedbackResponseDTO> sessionFeedbackCache;
    private final Cache<String, List<SessionFeedbackResponseDTO>> sessionFeedbackListCache;
    private final Cache<String, SessionFeedbackSummaryResponseDTO> sessionFeedbackSummaryCache;
    private static final Logger logger = LoggerFactory.getLogger(CacheableSessionFeedbackServiceImpl.class);

    public CacheableSessionFeedbackServiceImpl(SessionFeedbackServiceImpl sessionFeedbackServiceImpl, Cache<Integer, SessionFeedbackResponseDTO> sessionFeedbackCache, Cache<String, List<SessionFeedbackResponseDTO>> sessionFeedbackListCache, Cache<String, SessionFeedbackSummaryResponseDTO> sessionFeedbackSummaryCache) {
        this.sessionFeedbackServiceImpl = sessionFeedbackServiceImpl;
        this.sessionFeedbackCache = sessionFeedbackCache;
        this.sessionFeedbackListCache = sessionFeedbackListCache;
        this.sessionFeedbackSummaryCache = sessionFeedbackSummaryCache;
        logger.info("CacheableSessionFeedbackServiceImpl initialized with cache stats enabled");
    }

    @Override
    @Transactional
    public SessionFeedbackResponseDTO createFeedback(SessionFeedbackRequestDTO requestDTO) {
        SessionFeedbackResponseDTO response = sessionFeedbackServiceImpl.createFeedback(requestDTO);
        sessionFeedbackCache.put(response.getFeedbackId(), response);
        sessionFeedbackListCache.invalidateAll();
        sessionFeedbackSummaryCache.invalidateAll();
        logger.info("Cached new session feedback and invalidated list and summary caches after feedback creation");
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionFeedbackResponseDTO> getFeedbackBySessionId(Integer sessionId) {
        String cacheKey = "session_feedback_" + sessionId;
        logger.info("Cache lookup for session feedback with key: {}", cacheKey);

        List<SessionFeedbackResponseDTO> cachedFeedback = sessionFeedbackListCache.getIfPresent(cacheKey);
        if (cachedFeedback != null) {
            logger.debug("Cache HIT - Returning cached feedback for session ID: {}", sessionId);
            return cachedFeedback;
        }

        logger.info("Cache MISS - Fetching feedback from database for session ID: {}", sessionId);
        List<SessionFeedbackResponseDTO> response = sessionFeedbackServiceImpl.getFeedbackBySessionId(sessionId);
        sessionFeedbackListCache.put(cacheKey, response);
        logger.debug("Cached feedback for session ID: {}", sessionId);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public SessionFeedbackResponseDTO getFeedbackById(Integer feedbackId) {
        logger.info("Cache lookup for feedback ID: {}", feedbackId);
        SessionFeedbackResponseDTO cachedFeedback = sessionFeedbackCache.getIfPresent(feedbackId);

        if (cachedFeedback != null) {
            logger.debug("Cache HIT - Returning cached feedback for ID: {}", feedbackId);
            return cachedFeedback;
        }

        logger.info("Cache MISS - Fetching feedback from database for ID: {}", feedbackId);
        SessionFeedbackResponseDTO response = sessionFeedbackServiceImpl.getFeedbackById(feedbackId);
        sessionFeedbackCache.put(feedbackId, response);
        logger.debug("Cached feedback for ID: {}", feedbackId);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionFeedbackResponseDTO> getAllListenerFeedback(Integer listenerId) {
        String cacheKey = "listener_feedback_" + listenerId;
        logger.info("Cache lookup for listener feedback with key: {}", cacheKey);

        List<SessionFeedbackResponseDTO> cachedFeedback = sessionFeedbackListCache.getIfPresent(cacheKey);
        if (cachedFeedback != null) {
            logger.debug("Cache HIT - Returning cached feedback for listener ID: {}", listenerId);
            return cachedFeedback;
        }

        logger.info("Cache MISS - Fetching feedback from database for listener ID: {}", listenerId);
        List<SessionFeedbackResponseDTO> response = sessionFeedbackServiceImpl.getAllListenerFeedback(listenerId);
        sessionFeedbackListCache.put(cacheKey, response);
        logger.debug("Cached feedback for listener ID: {}", listenerId);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public SessionFeedbackSummaryResponseDTO getFeedbackSummary() {
        String cacheKey = "feedback_summary";
        logger.info("Cache lookup for feedback summary with key: {}", cacheKey);

        SessionFeedbackSummaryResponseDTO cachedSummary = sessionFeedbackSummaryCache.getIfPresent(cacheKey);
        if (cachedSummary != null) {
            logger.debug("Cache HIT - Returning cached feedback summary");
            return cachedSummary;
        }

        logger.info("Cache MISS - Fetching feedback summary from database");
        SessionFeedbackSummaryResponseDTO response = sessionFeedbackServiceImpl.getFeedbackSummary();
        sessionFeedbackSummaryCache.put(cacheKey, response);
        logger.debug("Cached feedback summary");

        return response;
    }

    public void logCacheStats() {
        logger.info("Current Cache Statistics:");
        logger.info("Session Feedback Cache - Size: {}", sessionFeedbackCache.stats());
        logger.info("Session Feedback List Cache - Size: {}", sessionFeedbackListCache.stats());
        logger.info("Session Feedback Summary Cache - Size: {}", sessionFeedbackSummaryCache.stats());
    }
}