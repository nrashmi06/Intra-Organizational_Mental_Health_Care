package com.dbms.mentalhealth.service.cachableImpl;

import com.dbms.mentalhealth.dto.SessionReport.request.SessionReportRequestDTO;
import com.dbms.mentalhealth.dto.SessionReport.response.SessionReportResponseDTO;
import com.dbms.mentalhealth.dto.SessionReport.response.SessionReportSummaryResponseDTO;
import com.dbms.mentalhealth.service.SessionReportService;
import com.dbms.mentalhealth.service.impl.SessionReportServiceImpl;
import com.dbms.mentalhealth.util.Cache.CacheKey.SessionReportCacheKey;
import com.dbms.mentalhealth.util.Cache.KeyEnum.SessionReportKeyType;
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
public class CacheableSessionReportServiceImpl implements SessionReportService {
    private static final Logger logger = LoggerFactory.getLogger(CacheableSessionReportServiceImpl.class);
    private final SessionReportServiceImpl sessionReportServiceImpl;
    private final Cache<SessionReportCacheKey, SessionReportResponseDTO> reportCache;
    private final Cache<SessionReportCacheKey, List<SessionReportResponseDTO>> reportListCache;
    private final Cache<SessionReportCacheKey, SessionReportSummaryResponseDTO> reportSummaryCache;

    public CacheableSessionReportServiceImpl(
            SessionReportServiceImpl sessionReportServiceImpl,
            Cache<SessionReportCacheKey, SessionReportResponseDTO> reportCache,
            Cache<SessionReportCacheKey, List<SessionReportResponseDTO>> reportListCache,
            Cache<SessionReportCacheKey, SessionReportSummaryResponseDTO> reportSummaryCache) {
        this.sessionReportServiceImpl = sessionReportServiceImpl;
        this.reportCache = reportCache;
        this.reportListCache = reportListCache;
        this.reportSummaryCache = reportSummaryCache;
        logger.info("CacheableSessionReportServiceImpl initialized with cache stats enabled");
    }

    private void invalidateAllCaches() {
        reportCache.invalidateAll();
        reportListCache.invalidateAll();
        logger.debug("Invalidated all caches");
    }

    @Override
    @Transactional
    public SessionReportResponseDTO createReport(SessionReportRequestDTO requestDTO) {
        SessionReportResponseDTO response = sessionReportServiceImpl.createReport(requestDTO);
        reportCache.put(new SessionReportCacheKey(response.getReportId(), SessionReportKeyType.REPORT), response);
        invalidateAllCaches();
        logger.info("Added new report to cache and invalidated all caches for report ID: {}", response.getReportId());
        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionReportResponseDTO> getReportBySessionId(Integer sessionId) {
        SessionReportCacheKey cacheKey = new SessionReportCacheKey(sessionId, SessionReportKeyType.SESSION_REPORT);
        logger.info("Cache lookup for session report with ID: {}", sessionId);

        return reportListCache.get(cacheKey, k -> {
            logger.debug("Cache MISS - Fetching report from database for session ID: {}", sessionId);
            return sessionReportServiceImpl.getReportBySessionId(sessionId);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public SessionReportResponseDTO getReportById(Integer reportId) {
        SessionReportCacheKey cacheKey = new SessionReportCacheKey(reportId, SessionReportKeyType.REPORT);
        logger.info("Cache lookup for report ID: {}", reportId);

        return reportCache.get(cacheKey, k -> {
            logger.debug("Cache MISS - Fetching report from database for ID: {}", reportId);
            return sessionReportServiceImpl.getReportById(reportId);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionReportResponseDTO> getAllUserReports(Integer userId) {
        SessionReportCacheKey cacheKey = new SessionReportCacheKey(userId, SessionReportKeyType.USER_REPORT);
        logger.info("Cache lookup for user reports with ID: {}", userId);

        return reportListCache.get(cacheKey, k -> {
            logger.debug("Cache MISS - Fetching reports from database for user ID: {}", userId);
            return sessionReportServiceImpl.getAllUserReports(userId);
        });
    }

    @Override
    @Transactional(readOnly = true)
    public SessionReportSummaryResponseDTO getReportSummary() {
        SessionReportCacheKey cacheKey = new SessionReportCacheKey("summary", SessionReportKeyType.SUMMARY);
        logger.info("Cache lookup for report summary");

        return reportSummaryCache.get(cacheKey, k -> {
            logger.debug("Cache MISS - Fetching report summary from database");
            return sessionReportServiceImpl.getReportSummary();
        });
    }

    public void logCacheStats() {
        CacheUtils.logCacheStats(reportCache);
        CacheUtils.logCacheStats(reportListCache);
        CacheUtils.logCacheStats(reportSummaryCache);
    }
}