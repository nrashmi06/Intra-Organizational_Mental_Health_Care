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
        String cacheKey = "session_report_" + sessionId;
        logger.info("Cache lookup for session report with key: {}", cacheKey);

        List<SessionReportResponseDTO> cachedReport = sessionReportListCache.getIfPresent(cacheKey);
        if (cachedReport != null) {
            logger.debug("Cache HIT - Returning cached report for session ID: {}", sessionId);
            return cachedReport;
        }

        logger.info("Cache MISS - Fetching report from database for session ID: {}", sessionId);
        List<SessionReportResponseDTO> response = sessionReportServiceImpl.getReportBySessionId(sessionId);
        sessionReportListCache.put(cacheKey, response);
        logger.debug("Cached report for session ID: {}", sessionId);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public SessionReportResponseDTO getReportById(Integer reportId) {
        logger.info("Cache lookup for report ID: {}", reportId);
        SessionReportResponseDTO cachedReport = sessionReportCache.getIfPresent(reportId);

        if (cachedReport != null) {
            logger.debug("Cache HIT - Returning cached report for ID: {}", reportId);
            return cachedReport;
        }

        logger.info("Cache MISS - Fetching report from database for ID: {}", reportId);
        SessionReportResponseDTO response = sessionReportServiceImpl.getReportById(reportId);
        sessionReportCache.put(reportId, response);
        logger.debug("Cached report for ID: {}", reportId);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionReportResponseDTO> getAllUserReports(Integer userId) {
        String cacheKey = "user_report_" + userId;
        logger.info("Cache lookup for user report with key: {}", cacheKey);

        List<SessionReportResponseDTO> cachedReport = sessionReportListCache.getIfPresent(cacheKey);
        if (cachedReport != null) {
            logger.debug("Cache HIT - Returning cached report for user ID: {}", userId);
            return cachedReport;
        }

        logger.info("Cache MISS - Fetching report from database for user ID: {}", userId);
        List<SessionReportResponseDTO> response = sessionReportServiceImpl.getAllUserReports(userId);
        sessionReportListCache.put(cacheKey, response);
        logger.debug("Cached report for user ID: {}", userId);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public SessionReportSummaryResponseDTO getReportSummary() {
        String cacheKey = "report_summary";
        logger.info("Cache lookup for report summary with key: {}", cacheKey);

        SessionReportSummaryResponseDTO cachedSummary = sessionReportSummaryCache.getIfPresent(cacheKey);
        if (cachedSummary != null) {
            logger.debug("Cache HIT - Returning cached report summary");
            return cachedSummary;
        }

        logger.info("Cache MISS - Fetching report summary from database");
        SessionReportSummaryResponseDTO response = sessionReportServiceImpl.getReportSummary();
        sessionReportSummaryCache.put(cacheKey, response);
        logger.debug("Cached report summary");

        return response;
    }

    public void logCacheStats() {
        logger.info("Current Cache Statistics:");
        logger.info("Session Report Cache - Size: {}", sessionReportCache.stats());
        logger.info("Session Report List Cache - Size: {}", sessionReportListCache.stats());
        logger.info("Session Report Summary Cache - Size: {}", sessionReportSummaryCache.stats());
    }
}