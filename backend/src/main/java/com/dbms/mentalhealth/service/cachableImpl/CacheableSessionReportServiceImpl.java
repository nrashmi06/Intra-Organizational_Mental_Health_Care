package com.dbms.mentalhealth.service.cachableImpl;

import com.dbms.mentalhealth.dto.session.request.SessionReportRequestDTO;
import com.dbms.mentalhealth.dto.session.response.SessionReportResponseDTO;
import com.dbms.mentalhealth.dto.session.response.SessionReportSummaryResponseDTO;
import com.dbms.mentalhealth.service.SessionReportService;
import com.dbms.mentalhealth.service.impl.SessionReportServiceImpl;
import com.github.benmanes.caffeine.cache.Cache;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Primary
public class CacheableSessionReportServiceImpl implements SessionReportService {

    private static final String CACHE_VERSION = "v1";
    private final SessionReportServiceImpl sessionReportServiceImpl;
    private final Cache<Integer, SessionReportResponseDTO> sessionReportCache;
    private final Cache<String, List<SessionReportResponseDTO>> sessionReportListCache;
    private final Cache<String, SessionReportSummaryResponseDTO> sessionReportSummaryCache;
    private static final Logger logger = LoggerFactory.getLogger(CacheableSessionReportServiceImpl.class);

    public CacheableSessionReportServiceImpl(SessionReportServiceImpl sessionReportServiceImpl, Cache<Integer, SessionReportResponseDTO> sessionReportCache, Cache<String, List<SessionReportResponseDTO>> sessionReportListCache, Cache<String, SessionReportSummaryResponseDTO> sessionReportSummaryCache) {
        this.sessionReportServiceImpl = sessionReportServiceImpl;
        this.sessionReportCache = sessionReportCache;
        this.sessionReportListCache = sessionReportListCache;
        this.sessionReportSummaryCache = sessionReportSummaryCache;
        logger.info("CacheableSessionReportServiceImpl initialized with cache stats enabled");
    }

    // Cache key generators
    private String generateSessionReportListCacheKey(String type, Integer id) {
        return String.format("%s:session_report:%s:%d", CACHE_VERSION, type, id);
    }

    private String generateSessionReportSummaryCacheKey() {
        return String.format("%s:session_report:summary", CACHE_VERSION);
    }

    @Override
    @Transactional
    public SessionReportResponseDTO createReport(SessionReportRequestDTO requestDTO) {
        SessionReportResponseDTO response = sessionReportServiceImpl.createReport(requestDTO);
        sessionReportCache.put(response.getReportId(), response);
        sessionReportListCache.invalidateAll();
        sessionReportSummaryCache.invalidateAll();
        logger.info("Cached new session report and invalidated list and summary caches after report creation");
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionReportResponseDTO> getReportBySessionId(Integer sessionId) {
        String cacheKey = generateSessionReportListCacheKey("session", sessionId);
        logger.info("Cache lookup for session report with key: {}", cacheKey);

        return sessionReportListCache.get(cacheKey, k -> {
            logger.debug("Cache MISS - Fetching report from database for session ID: {}", sessionId);
            return sessionReportServiceImpl.getReportBySessionId(sessionId);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public SessionReportResponseDTO getReportById(Integer reportId) {
        logger.info("Cache lookup for report ID: {}", reportId);
        return sessionReportCache.get(reportId, k -> {
            logger.debug("Cache MISS - Fetching report from database for ID: {}", reportId);
            return sessionReportServiceImpl.getReportById(reportId);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionReportResponseDTO> getAllUserReports(Integer userId) {
        String cacheKey = generateSessionReportListCacheKey("user", userId);
        logger.info("Cache lookup for user report with key: {}", cacheKey);

        return sessionReportListCache.get(cacheKey, k -> {
            logger.debug("Cache MISS - Fetching report from database for user ID: {}", userId);
            return sessionReportServiceImpl.getAllUserReports(userId);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public SessionReportSummaryResponseDTO getReportSummary() {
        String cacheKey = generateSessionReportSummaryCacheKey();
        logger.info("Cache lookup for report summary with key: {}", cacheKey);

        return sessionReportSummaryCache.get(cacheKey, k -> {
            logger.debug("Cache MISS - Fetching report summary from database");
            return sessionReportServiceImpl.getReportSummary();
        });
    }

    public void logCacheStats() {
        logger.info("Current Cache Statistics:");
        logger.info("Session Report Cache - Size: {}", sessionReportCache.stats());
        logger.info("Session Report List Cache - Size: {}", sessionReportListCache.stats());
        logger.info("Session Report Summary Cache - Size: {}", sessionReportSummaryCache.stats());
    }
}