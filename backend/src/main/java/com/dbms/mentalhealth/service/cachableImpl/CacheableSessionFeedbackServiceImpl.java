package com.dbms.mentalhealth.service.cachableImpl;

import com.dbms.mentalhealth.dto.sessionFeedback.request.SessionFeedbackRequestDTO;
import com.dbms.mentalhealth.dto.sessionFeedback.response.SessionFeedbackResponseDTO;
import com.dbms.mentalhealth.dto.sessionFeedback.response.SessionFeedbackSummaryResponseDTO;
import com.dbms.mentalhealth.repository.ListenerRepository;
import com.dbms.mentalhealth.service.SessionFeedbackService;
import com.dbms.mentalhealth.service.impl.SessionFeedbackServiceImpl;
import com.dbms.mentalhealth.util.Cache.CacheKey.SessionFeedbackCacheKey;
import com.dbms.mentalhealth.util.Cache.KeyEnum.SessionFeedbackKeyType;
import com.dbms.mentalhealth.util.Cache.CacheUtils;
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
    private static final Logger logger = LoggerFactory.getLogger(CacheableSessionFeedbackServiceImpl.class);
    private final SessionFeedbackServiceImpl sessionFeedbackServiceImpl;
    private final Cache<SessionFeedbackCacheKey, SessionFeedbackResponseDTO> feedbackCache;
    private final Cache<SessionFeedbackCacheKey, List<SessionFeedbackResponseDTO>> feedbackListCache;
    private final Cache<SessionFeedbackCacheKey, SessionFeedbackSummaryResponseDTO> feedbackSummaryCache;

    public CacheableSessionFeedbackServiceImpl(
            SessionFeedbackServiceImpl sessionFeedbackServiceImpl,
            Cache<SessionFeedbackCacheKey, SessionFeedbackResponseDTO> feedbackCache,
            Cache<SessionFeedbackCacheKey, List<SessionFeedbackResponseDTO>> feedbackListCache,
            Cache<SessionFeedbackCacheKey, SessionFeedbackSummaryResponseDTO> feedbackSummaryCache) {
        this.sessionFeedbackServiceImpl = sessionFeedbackServiceImpl;
        this.feedbackCache = feedbackCache;
        this.feedbackListCache = feedbackListCache;
        this.feedbackSummaryCache = feedbackSummaryCache;
        logger.info("CacheableSessionFeedbackServiceImpl initialized with cache stats enabled");
    }

    private void invalidateAllCaches() {
        feedbackCache.invalidateAll();
        feedbackListCache.invalidateAll();
        logger.debug("Invalidated all caches");
    }

    @Override
    @Transactional
    public SessionFeedbackResponseDTO createFeedback(SessionFeedbackRequestDTO requestDTO) {
        SessionFeedbackResponseDTO response = sessionFeedbackServiceImpl.createFeedback(requestDTO);
        feedbackCache.put(new SessionFeedbackCacheKey(response.getFeedbackId(), SessionFeedbackKeyType.FEEDBACK), response);
        invalidateAllCaches();
        logger.info("Added new feedback to cache and invalidated all caches for feedback ID: {}", response.getFeedbackId());
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionFeedbackResponseDTO> getFeedbackBySessionId(Integer sessionId) {
        SessionFeedbackCacheKey cacheKey = new SessionFeedbackCacheKey(sessionId, SessionFeedbackKeyType.SESSION_FEEDBACK);
        logger.info("Cache lookup for session feedback with ID: {}", sessionId);

        return feedbackListCache.get(cacheKey, k -> {
            logger.debug("Cache MISS - Fetching feedback from database for session ID: {}", sessionId);
            return sessionFeedbackServiceImpl.getFeedbackBySessionId(sessionId);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public SessionFeedbackResponseDTO getFeedbackById(Integer feedbackId) {
        SessionFeedbackCacheKey cacheKey = new SessionFeedbackCacheKey(feedbackId, SessionFeedbackKeyType.FEEDBACK);
        logger.info("Cache lookup for feedback ID: {}", feedbackId);

        return feedbackCache.get(cacheKey, k -> {
            logger.debug("Cache MISS - Fetching feedback from database for ID: {}", feedbackId);
            return sessionFeedbackServiceImpl.getFeedbackById(feedbackId);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionFeedbackResponseDTO> getAllListenerFeedback(Integer id, String type) {
        SessionFeedbackCacheKey cacheKey;
        if (type.equals("listenerId")) {
            cacheKey = new SessionFeedbackCacheKey(id, SessionFeedbackKeyType.LISTENER_FEEDBACK);
        } else {
            cacheKey = new SessionFeedbackCacheKey(id, SessionFeedbackKeyType.USER_FEEDBACK);
        }
        logger.info("Cache lookup for {} feedback with ID: {}", type, id);

        return feedbackListCache.get(cacheKey, k -> {
            logger.debug("Cache MISS - Fetching feedback from database for {} ID: {}", type, id);
            return sessionFeedbackServiceImpl.getAllListenerFeedback(id, type);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public SessionFeedbackSummaryResponseDTO getFeedbackSummary() {
        SessionFeedbackCacheKey cacheKey = new SessionFeedbackCacheKey("summary", SessionFeedbackKeyType.SUMMARY);
        logger.info("Cache lookup for feedback summary");

        return feedbackSummaryCache.get(cacheKey, k -> {
            logger.debug("Cache MISS - Fetching feedback summary from database");
            return sessionFeedbackServiceImpl.getFeedbackSummary();
        });
    }

    public void logCacheStats() {
        logger.info("=== Session Feedback Cache Statistics ===");
        CacheUtils.logCacheStats(feedbackCache, "Feedback Cache");
        CacheUtils.logCacheStats(feedbackListCache, "Feedback List Cache");
        CacheUtils.logCacheStats(feedbackSummaryCache, "Feedback Summary Cache");
    }
}