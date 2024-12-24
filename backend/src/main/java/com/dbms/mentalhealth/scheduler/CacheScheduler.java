package com.dbms.mentalhealth.scheduler;

import com.dbms.mentalhealth.service.cachableImpl.CacheableAdminServiceImpl;
import com.dbms.mentalhealth.service.cachableImpl.CacheableBlogServiceImpl;
import com.dbms.mentalhealth.service.cachableImpl.CacheableSessionServiceImpl;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class CacheScheduler {

    private final CacheableBlogServiceImpl cacheableBlogServiceImpl;
    private final CacheableAdminServiceImpl cacheableAdminServiceImpl;
    private final CacheableSessionServiceImpl cacheableSessionServiceImpl;

    public CacheScheduler(CacheableBlogServiceImpl cacheableBlogService, CacheableAdminServiceImpl cacheableAdminServiceImpl, CacheableSessionServiceImpl cacheableSessionServiceImpl) {
        this.cacheableBlogServiceImpl = cacheableBlogService;
        this.cacheableAdminServiceImpl = cacheableAdminServiceImpl;
        this.cacheableSessionServiceImpl = cacheableSessionServiceImpl;
    }

    @Scheduled(fixedRateString = "${scheduler.user-activity-cleanup-interval}")
    public void clearCache() {
        cacheableSessionServiceImpl.logCacheStats();
    }
}
