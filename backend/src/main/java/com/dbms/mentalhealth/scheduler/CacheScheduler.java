package com.dbms.mentalhealth.scheduler;

import com.dbms.mentalhealth.service.cachableImpl.*;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class CacheScheduler {

    private final CacheableBlogServiceImpl cacheableBlogServiceImpl;
    private final CacheableAdminServiceImpl cacheableAdminServiceImpl;
    private final CacheableSessionServiceImpl cacheableSessionServiceImpl;
    private final CacheableSessionFeedbackServiceImpl cacheableSessionFeedbackServiceImpl;
    private final CacheableSessionReportServiceImpl cacheableSessionReportServiceImpl;
    private final CacheableListenerApplicationServiceImpl cacheableListenerApplicationServiceImpl;
    private final CacheableListenerServiceImpl cacheableListenerServiceImpl;

    public CacheScheduler(CacheableBlogServiceImpl cacheableBlogService, CacheableAdminServiceImpl cacheableAdminServiceImpl, CacheableSessionServiceImpl cacheableSessionServiceImpl, CacheableSessionFeedbackServiceImpl cacheableSessionFeedbackServiceImpl, CacheableSessionReportServiceImpl cacheableSessionReportServiceImpl, CacheableListenerApplicationServiceImpl cacheableListenerApplicationServiceImpl, CacheableListenerServiceImpl cacheableListenerServiceImpl) {
        this.cacheableBlogServiceImpl = cacheableBlogService;
        this.cacheableAdminServiceImpl = cacheableAdminServiceImpl;
        this.cacheableSessionServiceImpl = cacheableSessionServiceImpl;
        this.cacheableSessionFeedbackServiceImpl = cacheableSessionFeedbackServiceImpl;
        this.cacheableSessionReportServiceImpl = cacheableSessionReportServiceImpl;
        this.cacheableListenerApplicationServiceImpl = cacheableListenerApplicationServiceImpl;
        this.cacheableListenerServiceImpl = cacheableListenerServiceImpl;
    }

    @Scheduled(fixedRateString = "${scheduler.user-activity-cleanup-interval}")
    public void clearCache() {
        cacheableSessionServiceImpl.logCacheStats();
        cacheableListenerApplicationServiceImpl.logCacheStats();
        cacheableListenerServiceImpl.logCacheStats();
    }
}
