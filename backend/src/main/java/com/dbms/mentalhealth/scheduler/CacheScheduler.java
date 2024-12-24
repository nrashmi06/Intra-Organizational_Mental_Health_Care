package com.dbms.mentalhealth.scheduler;

import com.dbms.mentalhealth.service.cachableImpl.CacheableBlogServiceImpl;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class CacheScheduler {

    private final CacheableBlogServiceImpl cacheableBlogService;

    public CacheScheduler(CacheableBlogServiceImpl cacheableBlogService) {
        this.cacheableBlogService = cacheableBlogService;
    }

    @Scheduled(fixedRateString = "${scheduler.user-activity-cleanup-interval}")
    public void clearCache() {
        cacheableBlogService.logCacheStats();
    }
}
