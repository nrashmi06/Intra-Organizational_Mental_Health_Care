package com.dbms.mentalhealth.service.cachableImpl;

import com.dbms.mentalhealth.dto.chatMessage.ChatMessageDTO;
import com.dbms.mentalhealth.dto.session.response.SessionResponseDTO;
import com.dbms.mentalhealth.dto.session.response.SessionSummaryDTO;
import com.dbms.mentalhealth.service.SessionService;
import com.dbms.mentalhealth.service.impl.SessionServiceImpl;
import com.dbms.mentalhealth.util.Cache.CacheKey.SessionCacheKey;
import com.dbms.mentalhealth.util.Cache.KeyEnum.SessionKeyType;
import com.dbms.mentalhealth.util.Cache.CacheUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.benmanes.caffeine.cache.Cache;
import org.springframework.context.annotation.Primary;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
@Primary
public class CacheableSessionServiceImpl implements SessionService {
    private static final Logger logger = LoggerFactory.getLogger(CacheableSessionServiceImpl.class);

    private final SessionServiceImpl sessionServiceImpl;
    private final Cache<SessionCacheKey, SessionResponseDTO> sessionCache;
    private final Cache<SessionCacheKey, List<ChatMessageDTO>> chatMessageCache;
    private final Cache<SessionCacheKey, String> metricsCache;
    private final String METRICS_CACHE_KEY = "average";
    public CacheableSessionServiceImpl(SessionServiceImpl sessionServiceImpl,
                                       Cache<SessionCacheKey, SessionResponseDTO> sessionCache,
                                       Cache<SessionCacheKey, List<ChatMessageDTO>> chatMessageCache,
                                       Cache<SessionCacheKey, String> metricsCache) {
        this.sessionServiceImpl = sessionServiceImpl;
        this.sessionCache = sessionCache;
        this.chatMessageCache = chatMessageCache;
        this.metricsCache = metricsCache;
        logger.info("CacheableSessionServiceImpl initialized");
    }

    @Override
    @Transactional(readOnly = true)
    public SessionResponseDTO getSessionById(Integer sessionId) {
        SessionCacheKey cacheKey = new SessionCacheKey(sessionId.toString(), SessionKeyType.SESSION);
        logger.debug("Cache lookup for session ID: {}", sessionId);
        return sessionCache.get(cacheKey, k -> {
            logger.info("Cache MISS - Fetching session from database for ID: {}", sessionId);
            SessionResponseDTO response = sessionServiceImpl.getSessionById(sessionId);
            logger.debug("Cached session for ID: {}", sessionId);
            return response;
        });
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatMessageDTO> getMessagesBySessionId(Integer sessionId) {
        SessionCacheKey cacheKey = new SessionCacheKey(sessionId.toString(), SessionKeyType.SESSION_METRICS);
        logger.debug("Cache lookup for session messages, ID: {}", sessionId);
        return chatMessageCache.get(cacheKey, k -> {
            logger.info("Cache MISS - Fetching messages from database for session ID: {}", sessionId);
            List<ChatMessageDTO> messages = sessionServiceImpl.getMessagesBySessionId(sessionId);
            logger.debug("Cached messages for session ID: {}", sessionId);
            return messages;
        });
    }

    @Override
    @Transactional(readOnly = true)
    public Page<SessionSummaryDTO> getSessionsByFilters(String status, Integer id, String idType, Pageable pageable) {
        return sessionServiceImpl.getSessionsByFilters(status, id, idType, pageable);
    }

    @Override
    @Transactional(readOnly = true)
    public String getAverageSessionDuration() {
        SessionCacheKey cacheKey = new SessionCacheKey("average", SessionKeyType.SESSION_METRICS);
        return metricsCache.get(cacheKey, k -> {
            logger.info("Cache MISS - Calculating average session duration");
            return sessionServiceImpl.getAverageSessionDuration();
        });
    }

    @Override
    @Transactional
    public String initiateSession(Integer listenerId, String message) throws JsonProcessingException {
        return  sessionServiceImpl.initiateSession(listenerId, message);
    }

    @Override
    @Transactional
    public String endSession(Integer sessionId) {
        String response = sessionServiceImpl.endSession(sessionId);
        invalidateSessionCaches(sessionId);
        logger.info("Session ended and caches invalidated for session ID: {}", sessionId);
        return response;
    }

    @Override
    @Transactional
    public String updateSessionStatus(Integer userId, String action) {
        return sessionServiceImpl.updateSessionStatus(userId, action);
    }

    @Override
    public List<SessionSummaryDTO> broadcastFullSessionCache() {
        return sessionServiceImpl.broadcastFullSessionCache();
    }

    @Override
    public boolean isUserInSession(Integer userId) {
        return sessionServiceImpl.isUserInSession(userId);
    }

    private void invalidateSessionCaches(Integer sessionId) {
        String sessionIdStr = sessionId.toString();
        SessionCacheKey sessionKey = new SessionCacheKey(sessionIdStr, SessionKeyType.SESSION);
        SessionCacheKey messagesKey = new SessionCacheKey(sessionIdStr, SessionKeyType.SESSION_MESSAGES);

        CacheUtils.invalidateCache(sessionCache, sessionKey);
        CacheUtils.invalidateCache(chatMessageCache, messagesKey);
    }

    public void logCacheStats() {
        logger.info("=== Session Cache Statistics ===");
        CacheUtils.logCacheStats(sessionCache, "Session Cache");
        CacheUtils.logCacheStats(chatMessageCache, "Chat Message Cache");
        CacheUtils.logCacheStats(metricsCache, "Metrics Cache");
    }
}