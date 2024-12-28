package com.dbms.mentalhealth.scheduler;

import com.dbms.mentalhealth.service.cachableImpl.*;
import com.dbms.mentalhealth.service.impl.ListenerApplicationServiceImpl;
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
    private final CacheableTimeSlotServiceImpl cacheableTimeSlotServiceImpl;
    private final CacheableAppointmentServiceImpl cacheableAppointmentServiceImpl;
    private final UserActivityServiceImpl userActivityServiceImpl;
    private final ListenerApplicationServiceImpl listenerApplicationServiceImpl;

    public CacheScheduler(CacheableAdminServiceImpl cacheableAdminServiceImpl,CacheableListenerServiceImpl cacheableListenerServiceImpl, CacheableSessionServiceImpl cacheableSessionServiceImpl, CacheableSessionFeedbackServiceImpl cacheableSessionFeedbackServiceImpl, CacheableSessionReportServiceImpl cacheableSessionReportServiceImpl, CacheableListenerApplicationServiceImpl cacheableListenerApplicationServiceImpl, CacheableTimeSlotServiceImpl cacheableTimeSlotServiceImpl, CacheableAppointmentServiceImpl cacheableAppointmentServiceImpl, UserActivityServiceImpl userActivityServiceImpl, ListenerApplicationServiceImpl listenerApplicationServiceImpl) {
        this.cacheableAdminServiceImpl = cacheableAdminServiceImpl;
        this.cacheableSessionServiceImpl = cacheableSessionServiceImpl;
        this.cacheableSessionFeedbackServiceImpl = cacheableSessionFeedbackServiceImpl;
        this.cacheableSessionReportServiceImpl = cacheableSessionReportServiceImpl;
        this.cacheableListenerApplicationServiceImpl = cacheableListenerApplicationServiceImpl;
        this.cacheableListenerServiceImpl = cacheableListenerServiceImpl;
        this.cacheableTimeSlotServiceImpl = cacheableTimeSlotServiceImpl;
        this.cacheableAppointmentServiceImpl = cacheableAppointmentServiceImpl;
        this.userActivityServiceImpl = userActivityServiceImpl;
        this.listenerApplicationServiceImpl = listenerApplicationServiceImpl;
    }

    @Scheduled(fixedRateString = "${scheduler.user-activity-cleanup-interval}")
    public void clearCache() {
        cacheableSessionServiceImpl.logCacheStats();
        cacheableListenerApplicationServiceImpl.logCacheStats();
        cacheableListenerServiceImpl.logCacheStats();
        cacheableSessionFeedbackServiceImpl.logCacheStats();
        cacheableSessionReportServiceImpl.logCacheStats();
        cacheableAdminServiceImpl.logCacheStats();
        cacheableTimeSlotServiceImpl.logCacheStats();
        cacheableAppointmentServiceImpl.logCacheStats();
        userActivityServiceImpl.logCacheStats();
        cacheableAdminServiceImpl.logCacheStats();
    }
}
