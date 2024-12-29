package com.dbms.mentalhealth.scheduler;

import com.dbms.mentalhealth.service.cachableImpl.*;
import com.dbms.mentalhealth.service.impl.UserActivityServiceImpl;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class CacheScheduler {

    private final CacheableAdminServiceImpl cacheableAdminServiceImpl;
    private final CacheableSessionServiceImpl cacheableSessionServiceImpl;
    private final CacheableSessionFeedbackServiceImpl cacheableSessionFeedbackServiceImpl;
    private final CacheableSessionReportServiceImpl cacheableSessionReportServiceImpl;
    private final CacheableListenerApplicationServiceImpl cacheableListenerApplicationServiceImpl;
    private final CacheableListenerServiceImpl cacheableListenerServiceImpl;
    private final UserActivityServiceImpl userActivityServiceImpl;

    public CacheScheduler(CacheableAdminServiceImpl cacheableAdminServiceImpl,
                          CacheableListenerServiceImpl cacheableListenerServiceImpl,
                          CacheableSessionServiceImpl cacheableSessionServiceImpl,
                          CacheableSessionFeedbackServiceImpl cacheableSessionFeedbackServiceImpl,
                          CacheableSessionReportServiceImpl cacheableSessionReportServiceImpl,
                          CacheableListenerApplicationServiceImpl cacheableListenerApplicationServiceImpl,
                          CacheableAppointmentServiceImpl cacheableAppointmentServiceImpl,
                          UserActivityServiceImpl userActivityServiceImpl) {
        this.cacheableAdminServiceImpl = cacheableAdminServiceImpl;
        this.cacheableSessionServiceImpl = cacheableSessionServiceImpl;
        this.cacheableSessionFeedbackServiceImpl = cacheableSessionFeedbackServiceImpl;
        this.cacheableSessionReportServiceImpl = cacheableSessionReportServiceImpl;
        this.cacheableListenerApplicationServiceImpl = cacheableListenerApplicationServiceImpl;
        this.cacheableListenerServiceImpl = cacheableListenerServiceImpl;
        this.userActivityServiceImpl = userActivityServiceImpl;
    }

    @Scheduled(fixedRateString = "${scheduler.user-activity-cleanup-interval}")
    public void clearCache() {
        cacheableSessionServiceImpl.logCacheStats();
        cacheableListenerApplicationServiceImpl.logCacheStats();
        cacheableListenerServiceImpl.logCacheStats();
        cacheableSessionFeedbackServiceImpl.logCacheStats();
        cacheableSessionReportServiceImpl.logCacheStats();
        cacheableAdminServiceImpl.logCacheStats();
        userActivityServiceImpl.logCacheStats();
        cacheableAdminServiceImpl.logCacheStats();
    }
}
