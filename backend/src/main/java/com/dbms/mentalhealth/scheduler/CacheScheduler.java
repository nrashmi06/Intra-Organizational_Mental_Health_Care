package com.dbms.mentalhealth.scheduler;

import com.dbms.mentalhealth.service.cachableImpl.CacheableAdminServiceImpl;
import com.dbms.mentalhealth.service.cachableImpl.CacheableBlogServiceImpl;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class CacheScheduler {

    private final CacheableBlogServiceImpl cacheableBlogServiceImpl;
    private final CacheableAdminServiceImpl cacheableAdminServiceImpl;

    public CacheScheduler(CacheableBlogServiceImpl cacheableBlogService, CacheableAdminServiceImpl cacheableAdminServiceImpl) {
        this.cacheableBlogServiceImpl = cacheableBlogService;
        this.cacheableAdminServiceImpl = cacheableAdminServiceImpl;
    }

    @Scheduled(fixedRateString = "${scheduler.user-activity-cleanup-interval}")
    public void clearCache() {
        cacheableBlogServiceImpl.logCacheStats();
        cacheableAdminServiceImpl.logCacheStats();
    }
}
