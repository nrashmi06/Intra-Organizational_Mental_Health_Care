package com.dbms.mentalhealth.service.cachableImpl;

import com.dbms.mentalhealth.dto.chatMessage.ChatMessageDTO;
import com.dbms.mentalhealth.dto.session.SessionResponseDTO;
import com.dbms.mentalhealth.dto.session.SessionSummaryDTO;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.SessionService;
import com.dbms.mentalhealth.service.impl.SessionServiceImpl;
import com.dbms.mentalhealth.util.Cache.CacheKey.SessionCacheKey;
import com.dbms.mentalhealth.util.Cache.KeyEnum.SessionKeyType;
import com.dbms.mentalhealth.util.Cache.CacheUtils;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.github.benmanes.caffeine.cache.Cache;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;

@Service
@Primary
public class CacheableSessionServiceImpl implements SessionService {

    private final SessionServiceImpl sessionServiceImpl;
    private final Cache<SessionCacheKey, SessionResponseDTO> sessionCache;
    private final Cache<SessionCacheKey, List<SessionSummaryDTO>> sessionListCache;
    private final Cache<SessionCacheKey, List<ChatMessageDTO>> messageCache;
    private final Cache<SessionCacheKey, String> metricsCache;
    private static final Logger logger = LoggerFactory.getLogger(CacheableSessionServiceImpl.class);
    private final JwtUtils jwtUtils;

    public CacheableSessionServiceImpl(SessionServiceImpl sessionServiceImpl,
                                       Cache<SessionCacheKey, SessionResponseDTO> sessionCache,
                                       Cache<SessionCacheKey, List<SessionSummaryDTO>> sessionListCache,
                                       Cache<SessionCacheKey, List<ChatMessageDTO>> messageCache,
                                       Cache<SessionCacheKey, String> metricsCache,
                                       JwtUtils jwtUtils) {
        this.sessionServiceImpl = sessionServiceImpl;
        this.sessionCache = sessionCache;
        this.sessionListCache = sessionListCache;
        this.messageCache = messageCache;
        this.metricsCache = metricsCache;
        this.jwtUtils = jwtUtils;
        logger.info("CacheableSessionServiceImpl initialized with cache stats enabled");
    }

    private void invalidateUserAndListenerCaches(Integer userId, Integer listenerId) {
        if (userId != null) {
            sessionListCache.invalidate(new SessionCacheKey(userId, SessionKeyType.USER_SESSIONS));
        }
        if (listenerId != null) {
            sessionListCache.invalidate(new SessionCacheKey(listenerId, SessionKeyType.LISTENER_SESSIONS));
            sessionListCache.invalidate(new SessionCacheKey(listenerId, SessionKeyType.LISTENER_USER_SESSIONS));
        }
    }

    @Override
    @Transactional(readOnly = true)
    public SessionResponseDTO getSessionById(Integer sessionId) {
        SessionCacheKey cacheKey = new SessionCacheKey(sessionId, SessionKeyType.SESSION);
        logger.info("Cache lookup for session ID: {}", sessionId);
        return sessionCache.get(cacheKey, k -> {
            logger.info("Cache MISS - Fetching session from database for ID: {}", sessionId);
            SessionResponseDTO response = sessionServiceImpl.getSessionById(sessionId);
            logger.debug("Cached session for ID: {}", sessionId);
            return response;
        });
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionSummaryDTO> getSessionsByUserIdOrListenerId(Integer id, String role) {
        SessionKeyType keyType = role.equalsIgnoreCase("listener") ?
                SessionKeyType.LISTENER_SESSIONS : SessionKeyType.USER_SESSIONS;
        SessionCacheKey cacheKey = new SessionCacheKey(id, keyType);

        logger.info("Cache lookup for sessions by {} ID: {}", role, id);
        return sessionListCache.get(cacheKey, k -> {
            logger.info("Cache MISS - Fetching sessions from database for {} ID: {}", role, id);
            return sessionServiceImpl.getSessionsByUserIdOrListenerId(id, role);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionSummaryDTO> getSessionsByStatus(String status) {
        SessionCacheKey cacheKey = new SessionCacheKey(status, SessionKeyType.STATUS_SESSIONS);
        logger.info("Cache lookup for sessions with status: {}", status);
        return sessionListCache.get(cacheKey, k -> {
            logger.info("Cache MISS - Fetching sessions from database for status: {}", status);
            return sessionServiceImpl.getSessionsByStatus(status);
        });
    }

    @Override
    @Transactional
    public String updateSessionStatus(Integer userId, String action) {
        String response = sessionServiceImpl.updateSessionStatus(userId, action);

        // Invalidate all status-based caches since status has changed
        sessionListCache.asMap().keySet().stream()
                .filter(key -> key.getKeyType() == SessionKeyType.STATUS_SESSIONS)
                .forEach(sessionListCache::invalidate);

        // Invalidate user and listener session caches
        sessionListCache.invalidate(new SessionCacheKey(userId, SessionKeyType.USER_SESSIONS));
        sessionListCache.invalidate(new SessionCacheKey(userId, SessionKeyType.LISTENER_USER_SESSIONS));

        return response;
    }

    @Override
    @Transactional
    public String endSession(Integer sessionId) {
        SessionResponseDTO session = getSessionById(sessionId);
        String response = sessionServiceImpl.endSession(sessionId);

        // Invalidate session cache
        sessionCache.invalidate(new SessionCacheKey(sessionId, SessionKeyType.SESSION));
        messageCache.invalidate(new SessionCacheKey(sessionId, SessionKeyType.SESSION_MESSAGES));

        // Invalidate related caches
        invalidateUserAndListenerCaches(session.getUserId(), session.getListenerId());

        // Invalidate status and metrics caches
        sessionListCache.asMap().keySet().stream()
                .filter(key -> key.getKeyType() == SessionKeyType.STATUS_SESSIONS)
                .forEach(sessionListCache::invalidate);
        metricsCache.invalidateAll();

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionSummaryDTO> getAllSessions() {
        SessionCacheKey cacheKey = new SessionCacheKey("all", SessionKeyType.ALL_SESSIONS);
        return sessionListCache.get(cacheKey, k -> {
            logger.info("Cache MISS - Fetching all sessions from database");
            return sessionServiceImpl.getAllSessions();
        });
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatMessageDTO> getMessagesBySessionId(Integer sessionId) {
        SessionCacheKey cacheKey = new SessionCacheKey(sessionId, SessionKeyType.SESSION_MESSAGES);
        return messageCache.get(cacheKey, k -> {
            logger.info("Cache MISS - Fetching messages for session ID: {}", sessionId);
            return sessionServiceImpl.getMessagesBySessionId(sessionId);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public String getAverageSessionDuration() {
        SessionCacheKey cacheKey = new SessionCacheKey("avgDuration", SessionKeyType.SESSION_METRICS);
        return metricsCache.get(cacheKey, k -> {
            logger.info("Cache MISS - Calculating average session duration");
            return sessionServiceImpl.getAverageSessionDuration();
        });
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionSummaryDTO> getSessionsByListenersUserId(Integer userId) {
        SessionCacheKey cacheKey = new SessionCacheKey(userId, SessionKeyType.LISTENER_USER_SESSIONS);
        return sessionListCache.get(cacheKey, k -> {
            logger.info("Cache MISS - Fetching sessions for listener user ID: {}", userId);
            return sessionServiceImpl.getSessionsByListenersUserId(userId);
        });
    }

    @Override
    public List<SessionSummaryDTO> broadcastFullSessionCache() {
        return sessionServiceImpl.broadcastFullSessionCache();
    }

    @Override
    public boolean isUserInSession(Integer userId) {
        return sessionServiceImpl.isUserInSession(userId);
    }

    @Override
    @Transactional
    public String initiateSession(Integer listenerId, String message) throws JsonProcessingException {
        return sessionServiceImpl.initiateSession(listenerId, message);
    }

    public void logCacheStats() {
        CacheUtils.logCacheStats(sessionCache);
        CacheUtils.logCacheStats(sessionListCache);
        CacheUtils.logCacheStats(messageCache);
        CacheUtils.logCacheStats(metricsCache);
    }
}