package com.dbms.mentalhealth.service.cachableImpl;

import com.dbms.mentalhealth.dto.chatMessage.ChatMessageDTO;
import com.dbms.mentalhealth.dto.session.SessionResponseDTO;
import com.dbms.mentalhealth.dto.session.SessionSummaryDTO;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.SessionService;
import com.dbms.mentalhealth.service.impl.SessionServiceImpl;
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

    private static final String CACHE_VERSION = "v1";
    private final SessionServiceImpl sessionServiceImpl;
    private final Cache<String, SessionResponseDTO> sessionCache;
    private final Cache<String, List<SessionSummaryDTO>> sessionListCache;
    private final Cache<String, List<ChatMessageDTO>> chatMessageCache;
    private final Cache<String, String> metricsCache;
    private static final Logger logger = LoggerFactory.getLogger(CacheableSessionServiceImpl.class);
    private final JwtUtils jwtUtils;

    public CacheableSessionServiceImpl(
            SessionServiceImpl sessionServiceImpl,
            Cache<String, SessionResponseDTO> sessionCache,
            Cache<String, List<SessionSummaryDTO>> sessionListCache,
            Cache<String, List<ChatMessageDTO>> chatMessageCache,
            Cache<String, String> metricsCache,
            JwtUtils jwtUtils) {
        this.sessionServiceImpl = sessionServiceImpl;
        this.sessionCache = sessionCache;
        this.sessionListCache = sessionListCache;
        this.chatMessageCache = chatMessageCache;
        this.metricsCache = metricsCache;
        this.jwtUtils = jwtUtils;
        logger.info("CacheableSessionServiceImpl initialized with comprehensive caching");
    }

    // Cache key generators
    private String generateSessionCacheKey(Integer sessionId, Integer viewerId) {
        return String.format("%s:session:%d:viewer:%d", CACHE_VERSION, sessionId, viewerId);
    }

    private String generateSessionListCacheKey(String type, Integer id) {
        return String.format("%s:sessions:%s:%d", CACHE_VERSION, type, id);
    }

    private String generateStatusListCacheKey(String status) {
        return String.format("%s:sessions:status:%s", CACHE_VERSION, status.toLowerCase());
    }

    private String generateChatMessagesCacheKey(Integer sessionId) {
        return String.format("%s:messages:session:%d", CACHE_VERSION, sessionId);
    }

    @Override
    @Transactional(readOnly = true)
    public SessionResponseDTO getSessionById(Integer sessionId) {
        String cacheKey = generateSessionCacheKey(sessionId, getCurrentUserId());
        return sessionCache.get(cacheKey, k -> {
            logger.debug("Cache MISS - Fetching session: {}", sessionId);
            return sessionServiceImpl.getSessionById(sessionId);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionSummaryDTO> getSessionsByUserIdOrListenerId(Integer id, String role) {
        String cacheKey = generateSessionListCacheKey(role, id);
        return sessionListCache.get(cacheKey, k -> {
            logger.debug("Cache MISS - Fetching sessions for {} ID: {}", role, id);
            return sessionServiceImpl.getSessionsByUserIdOrListenerId(id, role);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionSummaryDTO> getSessionsByStatus(String status) {
        String cacheKey = generateStatusListCacheKey(status);
        return sessionListCache.get(cacheKey, k -> {
            logger.debug("Cache MISS - Fetching sessions for status: {}", status);
            return sessionServiceImpl.getSessionsByStatus(status);
        });
    }

    @Override
    @Transactional
    public String initiateSession(Integer listenerId, String message) throws JsonProcessingException {
        String response = sessionServiceImpl.initiateSession(listenerId, message);
        invalidateListenerSessionCaches(listenerId);
        invalidateStatusBasedCaches();
        return response;
    }

    @Override
    @Transactional
    public String updateSessionStatus(Integer userId, String action) {
        String response = sessionServiceImpl.updateSessionStatus(userId, action);
        invalidateUserRelatedCaches(userId);
        invalidateStatusBasedCaches();
        return response;
    }

    @Override
    @Transactional
    public String endSession(Integer sessionId) {
        SessionResponseDTO session = getSessionById(sessionId);
        String response = sessionServiceImpl.endSession(sessionId);

        invalidateSessionCaches(sessionId);
        invalidateUserRelatedCaches(session.getUserId());
        if (session.getListenerId() != null) {
            invalidateListenerSessionCaches(session.getListenerId());
        }
        invalidateStatusBasedCaches();

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionSummaryDTO> getAllSessions() {
        return sessionServiceImpl.getAllSessions();
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatMessageDTO> getMessagesBySessionId(Integer sessionId) {
        String cacheKey = generateChatMessagesCacheKey(sessionId);
        return chatMessageCache.get(cacheKey, k -> {
            logger.debug("Cache MISS - Fetching messages for session: {}", sessionId);
            return sessionServiceImpl.getMessagesBySessionId(sessionId);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public String getAverageSessionDuration() {
        String cacheKey = CACHE_VERSION + ":metrics:avg-duration";
        return metricsCache.get(cacheKey, k -> {
            logger.debug("Cache MISS - Calculating average session duration");
            return sessionServiceImpl.getAverageSessionDuration();
        });
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionSummaryDTO> getSessionsByListenersUserId(Integer userId) {
        String cacheKey = generateSessionListCacheKey("listener-user", userId);
        return sessionListCache.get(cacheKey, k -> {
            logger.debug("Cache MISS - Fetching sessions for listener user: {}", userId);
            return sessionServiceImpl.getSessionsByListenersUserId(userId);
        });
    }

    // Cache invalidation methods
    private void invalidateSessionCaches(Integer sessionId) {
        sessionCache.asMap().keySet().stream()
                .filter(key -> key.contains(":session:" + sessionId + ":"))
                .forEach(sessionCache::invalidate);
        chatMessageCache.invalidate(generateChatMessagesCacheKey(sessionId));
    }

    private void invalidateUserRelatedCaches(Integer userId) {
        sessionListCache.invalidate(generateSessionListCacheKey("user", userId));
        sessionListCache.invalidate(generateSessionListCacheKey("listener", userId));
        sessionListCache.invalidate(generateSessionListCacheKey("listener-user", userId));
    }

    private void invalidateListenerSessionCaches(Integer listenerId) {
        sessionListCache.invalidate(generateSessionListCacheKey("listener", listenerId));
    }

    private void invalidateStatusBasedCaches() {
        sessionListCache.asMap().keySet().stream()
                .filter(key -> key.contains(":sessions:status:"))
                .forEach(sessionListCache::invalidate);
        sessionListCache.invalidate(CACHE_VERSION + ":sessions:all");
        metricsCache.invalidateAll();
    }

    private Integer getCurrentUserId() {
        return jwtUtils.getUserIdFromContext();
    }

    public void logCacheStats() {
        logger.info("Session Cache Stats: {}", sessionCache.stats());
        logger.info("Session List Cache Stats: {}", sessionListCache.stats());
        logger.info("Chat Message Cache Stats: {}", chatMessageCache.stats());
        logger.info("Metrics Cache Stats: {}", metricsCache.stats());
    }
}