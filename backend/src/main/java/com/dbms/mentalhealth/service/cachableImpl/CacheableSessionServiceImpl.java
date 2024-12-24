package com.dbms.mentalhealth.service.cachableImpl;

import com.dbms.mentalhealth.dto.chatMessage.ChatMessageDTO;
import com.dbms.mentalhealth.dto.session.SessionResponseDTO;
import com.dbms.mentalhealth.dto.session.SessionSummaryDTO;
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
import java.util.Objects;

@Service
@Primary
public class CacheableSessionServiceImpl implements SessionService {

    private final SessionServiceImpl sessionServiceImpl;
    private final Cache<Integer, SessionResponseDTO> sessionCache;
    private final Cache<String, List<SessionSummaryDTO>> sessionListCache;
    private final Cache<Integer, List<ChatMessageDTO>> chatMessageCache;
    private final Cache<String, String> averageSessionDurationCache;
    private static final Logger logger = LoggerFactory.getLogger(CacheableSessionServiceImpl.class);

    public CacheableSessionServiceImpl(SessionServiceImpl sessionServiceImpl, Cache<Integer, SessionResponseDTO> sessionCache, Cache<String, List<SessionSummaryDTO>> sessionListCache, Cache<Integer, List<ChatMessageDTO>> chatMessageCache, Cache<String, String> averageSessionDurationCache) {
        this.sessionServiceImpl = sessionServiceImpl;
        this.sessionCache = sessionCache;
        this.sessionListCache = sessionListCache;
        this.chatMessageCache = chatMessageCache;
        this.averageSessionDurationCache = averageSessionDurationCache;
        logger.info("CacheableSessionServiceImpl initialized with cache stats enabled");
    }

    @Override
    @Transactional(readOnly = true)
    public SessionResponseDTO getSessionById(Integer sessionId) {
        logger.info("Cache lookup for session ID: {}", sessionId);
        SessionResponseDTO cachedSession = sessionCache.getIfPresent(sessionId);

        if (cachedSession != null) {
            logger.debug("Cache HIT - Returning cached session for ID: {}", sessionId);
            return cachedSession;
        }

        logger.info("Cache MISS - Fetching session from database for ID: {}", sessionId);
        SessionResponseDTO response = sessionServiceImpl.getSessionById(sessionId);
        sessionCache.put(sessionId, response);
        logger.debug("Cached session with ID: {}", sessionId);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionSummaryDTO> getSessionsByUserIdOrListenerId(Integer id, String role) {
        String cacheKey = Objects.hash(role, id) + "";
        logger.info("Cache lookup for sessions with key: {}", cacheKey);

        List<SessionSummaryDTO> cachedSessions = sessionListCache.getIfPresent(cacheKey);
        if (cachedSessions != null) {
            logger.debug("Cache HIT - Returning cached sessions for key: {}", cacheKey);
            return cachedSessions;
        }

        logger.info("Cache MISS - Fetching sessions from database for key: {}", cacheKey);
        List<SessionSummaryDTO> response = sessionServiceImpl.getSessionsByUserIdOrListenerId(id, role);
        sessionListCache.put(cacheKey, response);
        logger.debug("Cached sessions for key: {}", cacheKey);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionSummaryDTO> getSessionsByStatus(String status) {
        String cacheKey = "status_" + status.toLowerCase();
        logger.info("Cache lookup for sessions with status: {}", status);

        List<SessionSummaryDTO> cachedSessions = sessionListCache.getIfPresent(cacheKey);
        if (cachedSessions != null) {
            logger.debug("Cache HIT - Returning cached sessions for status: {}", status);
            return cachedSessions;
        }

        logger.info("Cache MISS - Fetching sessions from database for status: {}", status);
        List<SessionSummaryDTO> response = sessionServiceImpl.getSessionsByStatus(status);
        sessionListCache.put(cacheKey, response);
        logger.debug("Cached sessions for status: {}", status);

        return response;
    }

    @Override
    @Transactional
    public String initiateSession(Integer listenerId, String message) throws JsonProcessingException {
        String response = sessionServiceImpl.initiateSession(listenerId, message);
        sessionCache.invalidateAll();
        sessionListCache.invalidateAll();
        chatMessageCache.invalidateAll();
        averageSessionDurationCache.invalidateAll();
        logger.info("All caches invalidated after session initiation");

        return response;
    }

    @Override
    @Transactional
    public String updateSessionStatus(Integer userId, String action) {
        String response = sessionServiceImpl.updateSessionStatus(userId, action);
        sessionCache.invalidateAll();
        sessionListCache.invalidateAll();
        chatMessageCache.invalidateAll();
        averageSessionDurationCache.invalidateAll();
        logger.info("All caches invalidated after session status update");

        return response;
    }

    @Override
    @Transactional
    public String endSession(Integer sessionId) {
        String response = sessionServiceImpl.endSession(sessionId);
        sessionCache.invalidate(sessionId);
        sessionListCache.invalidateAll();
        chatMessageCache.invalidate(sessionId);
        averageSessionDurationCache.invalidateAll();
        logger.info("Session cache invalidated and list cache invalidated for session ID: {}", sessionId);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionSummaryDTO> getAllSessions() {
        String cacheKey = "all_sessions";
        logger.info("Cache lookup for all sessions");

        List<SessionSummaryDTO> cachedSessions = sessionListCache.getIfPresent(cacheKey);
        if (cachedSessions != null) {
            logger.debug("Cache HIT - Returning cached all sessions");
            return cachedSessions;
        }

        logger.info("Cache MISS - Fetching all sessions from database");
        List<SessionSummaryDTO> response = sessionServiceImpl.getAllSessions();
        sessionListCache.put(cacheKey, response);
        logger.debug("Cached all sessions");

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<ChatMessageDTO> getMessagesBySessionId(Integer sessionId) {
        logger.info("Cache lookup for chat messages by session ID: {}", sessionId);
        List<ChatMessageDTO> cachedMessages = chatMessageCache.getIfPresent(sessionId);

        if (cachedMessages != null) {
            logger.debug("Cache HIT - Returning cached chat messages for session ID: {}", sessionId);
            return cachedMessages;
        }

        logger.info("Cache MISS - Fetching chat messages from database for session ID: {}", sessionId);
        List<ChatMessageDTO> response = sessionServiceImpl.getMessagesBySessionId(sessionId);
        chatMessageCache.put(sessionId, response);
        logger.debug("Cached chat messages for session ID: {}", sessionId);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public String getAverageSessionDuration() {
        String cacheKey = "average_session_duration";
        logger.info("Cache lookup for average session duration");

        String cachedDuration = averageSessionDurationCache.getIfPresent(cacheKey);
        if (cachedDuration != null) {
            logger.debug("Cache HIT - Returning cached average session duration");
            return cachedDuration;
        }

        logger.info("Cache MISS - Calculating average session duration");
        String response = sessionServiceImpl.getAverageSessionDuration();
        averageSessionDurationCache.put(cacheKey, response);
        logger.debug("Cached average session duration");

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionSummaryDTO> getSessionsByListenersUserId(Integer userId) {
        String cacheKey = "listener_sessions_" + userId;
        logger.info("Cache lookup for sessions by listener's user ID: {}", userId);

        List<SessionSummaryDTO> cachedSessions = sessionListCache.getIfPresent(cacheKey);
        if (cachedSessions != null) {
            logger.debug("Cache HIT - Returning cached sessions for listener's user ID: {}", userId);
            return cachedSessions;
        }

        logger.info("Cache MISS - Fetching sessions from database for listener's user ID: {}", userId);
        List<SessionSummaryDTO> response = sessionServiceImpl.getSessionsByListenersUserId(userId);
        sessionListCache.put(cacheKey, response);
        logger.debug("Cached sessions for listener's user ID: {}", userId);

        return response;
    }
    //add log method for cache
    public void logCacheStats() {
        logger.info("Session Cache Stats: {}", sessionCache.stats());
        logger.info("Session List Cache Stats: {}", sessionListCache.stats());
        logger.info("Chat Message Cache Stats: {}", chatMessageCache.stats());
        logger.info("Average Session Duration Cache Stats: {}", averageSessionDurationCache.stats());
    }
}