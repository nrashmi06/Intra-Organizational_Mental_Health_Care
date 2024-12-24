package com.dbms.mentalhealth.scheduler;

import com.dbms.mentalhealth.service.cachableImpl.CacheableAdminServiceImpl;
import com.dbms.mentalhealth.service.cachableImpl.CacheableBlogServiceImpl;
import com.dbms.mentalhealth.service.cachableImpl.CacheableSessionFeedbackServiceImpl;
import com.dbms.mentalhealth.service.cachableImpl.CacheableSessionServiceImpl;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class CacheScheduler {

    private final CacheableBlogServiceImpl cacheableBlogServiceImpl;
    private final CacheableAdminServiceImpl cacheableAdminServiceImpl;
    private final CacheableSessionServiceImpl cacheableSessionServiceImpl;
    private final CacheableSessionFeedbackServiceImpl cacheableSessionFeedbackServiceImpl;

    public CacheScheduler(CacheableBlogServiceImpl cacheableBlogService, CacheableAdminServiceImpl cacheableAdminServiceImpl, CacheableSessionServiceImpl cacheableSessionServiceImpl, CacheableSessionFeedbackServiceImpl cacheableSessionFeedbackServiceImpl) {
        this.cacheableBlogServiceImpl = cacheableBlogService;
        this.cacheableAdminServiceImpl = cacheableAdminServiceImpl;
        this.cacheableSessionServiceImpl = cacheableSessionServiceImpl;
        this.cacheableSessionFeedbackServiceImpl = cacheableSessionFeedbackServiceImpl;
    }

    @Scheduled(fixedRateString = "${scheduler.user-activity-cleanup-interval}")
    public void clearCache() {
        cacheableSessionServiceImpl.logCacheStats();
        cacheableSessionFeedbackServiceImpl.logCacheStats();
    }
}
