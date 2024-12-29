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
    private final UserActivityServiceImpl userActivityServiceImpl;
    private final CacheableAppointmentServiceImpl cacheableAppointmentServiceImpl;
    private final CacheableEmergencyHelplineServiceImpl cacheableEmergencyHelplineServiceImpl;
    public CacheScheduler(CacheableAdminServiceImpl cacheableAdminServiceImpl,
                          CacheableSessionServiceImpl cacheableSessionServiceImpl,
                          CacheableSessionFeedbackServiceImpl cacheableSessionFeedbackServiceImpl,
                          CacheableSessionReportServiceImpl cacheableSessionReportServiceImpl,
                          CacheableListenerApplicationServiceImpl cacheableListenerApplicationServiceImpl,
                          UserActivityServiceImpl userActivityServiceImpl,
                          CacheableAppointmentServiceImpl cacheableAppointmentServiceImpl,
                          CacheableEmergencyHelplineServiceImpl cacheableEmergencyHelplineServiceImpl) {
        this.cacheableAdminServiceImpl = cacheableAdminServiceImpl;
        this.cacheableSessionServiceImpl = cacheableSessionServiceImpl;
        this.cacheableSessionFeedbackServiceImpl = cacheableSessionFeedbackServiceImpl;
        this.cacheableSessionReportServiceImpl = cacheableSessionReportServiceImpl;
        this.cacheableListenerApplicationServiceImpl = cacheableListenerApplicationServiceImpl;
        this.userActivityServiceImpl = userActivityServiceImpl;
        this.cacheableAppointmentServiceImpl = cacheableAppointmentServiceImpl;
        this.cacheableEmergencyHelplineServiceImpl = cacheableEmergencyHelplineServiceImpl;
    }

    @Scheduled(fixedRateString = "${scheduler.user-activity-cleanup-interval}")
    public void logCacheStatus() {
        cacheableSessionServiceImpl.logCacheStats();
        cacheableListenerApplicationServiceImpl.logCacheStats();
        cacheableSessionFeedbackServiceImpl.logCacheStats();
        cacheableSessionReportServiceImpl.logCacheStats();
        cacheableAdminServiceImpl.logCacheStats();
        userActivityServiceImpl.logCacheStats();
        cacheableAdminServiceImpl.logCacheStats();
        cacheableAppointmentServiceImpl.logCacheStats();
        cacheableEmergencyHelplineServiceImpl.logCacheStats();
    }
}
