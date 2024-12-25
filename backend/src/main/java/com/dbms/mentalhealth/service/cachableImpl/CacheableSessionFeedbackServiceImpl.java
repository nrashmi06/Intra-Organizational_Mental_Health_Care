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

    private static final String CACHE_VERSION = "v1";
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

    // Cache key generators
    private String generateSessionFeedbackListCacheKey(String type, Integer id) {
        return String.format("%s:session_feedback:%s:%d", CACHE_VERSION, type, id);
    }

    private String generateSessionFeedbackSummaryCacheKey() {
        return String.format("%s:session_feedback:summary", CACHE_VERSION);
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
        String cacheKey = generateSessionFeedbackListCacheKey("session", sessionId);
        logger.info("Cache lookup for session feedback with key: {}", cacheKey);

        return sessionFeedbackListCache.get(cacheKey, k -> {
            logger.debug("Cache MISS - Fetching feedback from database for session ID: {}", sessionId);
            return sessionFeedbackServiceImpl.getFeedbackBySessionId(sessionId);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public SessionFeedbackResponseDTO getFeedbackById(Integer feedbackId) {
        logger.info("Cache lookup for feedback ID: {}", feedbackId);
        return sessionFeedbackCache.get(feedbackId, k -> {
            logger.debug("Cache MISS - Fetching feedback from database for ID: {}", feedbackId);
            return sessionFeedbackServiceImpl.getFeedbackById(feedbackId);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionFeedbackResponseDTO> getAllListenerFeedback(Integer listenerId) {
        String cacheKey = generateSessionFeedbackListCacheKey("listener", listenerId);
        logger.info("Cache lookup for listener feedback with key: {}", cacheKey);

        return sessionFeedbackListCache.get(cacheKey, k -> {
            logger.debug("Cache MISS - Fetching feedback from database for listener ID: {}", listenerId);
            return sessionFeedbackServiceImpl.getAllListenerFeedback(listenerId);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public SessionFeedbackSummaryResponseDTO getFeedbackSummary() {
        String cacheKey = generateSessionFeedbackSummaryCacheKey();
        logger.info("Cache lookup for feedback summary with key: {}", cacheKey);

        return sessionFeedbackSummaryCache.get(cacheKey, k -> {
            logger.debug("Cache MISS - Fetching feedback summary from database");
            return sessionFeedbackServiceImpl.getFeedbackSummary();
        });
    }

    public void logCacheStats() {
        logger.info("Current Cache Statistics:");
        logger.info("Session Feedback Cache - Size: {}", sessionFeedbackCache.stats());
        logger.info("Session Feedback List Cache - Size: {}", sessionFeedbackListCache.stats());
        logger.info("Session Feedback Summary Cache - Size: {}", sessionFeedbackSummaryCache.stats());
    }
}