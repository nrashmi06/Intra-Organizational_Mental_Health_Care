package com.dbms.mentalhealth.config;

import com.dbms.mentalhealth.dto.Admin.response.AdminProfileResponseDTO;
import com.dbms.mentalhealth.dto.Admin.response.AdminProfileSummaryResponseDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentResponseDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentSummaryResponseDTO;
import com.dbms.mentalhealth.dto.EmergencyHelpline.EmergencyHelplineDTO;
import com.dbms.mentalhealth.dto.Listener.response.ListenerDetailsResponseDTO;
import com.dbms.mentalhealth.dto.UserActivity.UserActivityDTO;
import com.dbms.mentalhealth.dto.adminSettings.response.AdminSettingsResponseDTO;
import com.dbms.mentalhealth.dto.chatMessage.ChatMessageDTO;
import com.dbms.mentalhealth.dto.listenerApplication.response.ListenerApplicationResponseDTO;
import com.dbms.mentalhealth.dto.listenerApplication.response.ListenerApplicationSummaryResponseDTO;
import com.dbms.mentalhealth.dto.session.response.SessionResponseDTO;
import com.dbms.mentalhealth.dto.SessionReport.response.SessionReportResponseDTO;
import com.dbms.mentalhealth.dto.SessionReport.response.SessionReportSummaryResponseDTO;
import com.dbms.mentalhealth.dto.sessionFeedback.response.SessionFeedbackResponseDTO;
import com.dbms.mentalhealth.dto.sessionFeedback.response.SessionFeedbackSummaryResponseDTO;
import com.dbms.mentalhealth.model.Session;
import com.dbms.mentalhealth.service.UserActivityService;
import com.dbms.mentalhealth.util.Cache.CacheKey.*;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.locks.Lock;
import java.util.concurrent.locks.ReentrantLock;

@Configuration
@EnableCaching(proxyTargetClass = true)
public class CacheConfig {
    private static final Logger logger = LoggerFactory.getLogger(CacheConfig.class);
    private static final int LARGE_CACHE_SIZE = 1000;
    private static final int MEDIUM_CACHE_SIZE = 500;
    private static final int STANDARD_CACHE_SIZE = 100;
    private static final int SMALL_CACHE_SIZE = 50;
    private static final int TINY_CACHE_SIZE = 10;
    private static final int USER_INACTIVITY_MINUTES = 30;

    private final Lock lock = new ReentrantLock();

    @Value("${cache.duration.minutes}")
    private Long cacheExpiry;

    private final UserActivityService userActivityService;

    @Autowired
    public CacheConfig(@Lazy UserActivityService userActivityService) {
        this.userActivityService = userActivityService;
    }

    // Create base Caffeine builder with common configurations
    private Caffeine<Object, Object> createBaseBuilder() {
        return Caffeine.newBuilder()
                .recordStats()
                .removalListener((key, value, cause) ->
                        logger.info("Key {} was removed ({})", key, cause));
    }

    // Create standard cache builder
    private Caffeine<Object, Object> createStandardBuilder() {
        return createBaseBuilder()
                .expireAfterAccess(cacheExpiry, TimeUnit.MINUTES);
    }

    // Create list cache builder
    private Caffeine<Object, Object> createListBuilder() {
        return createBaseBuilder()
                .expireAfterWrite(cacheExpiry, TimeUnit.MINUTES);
    }

    private Caffeine<Object, Object> createUserDetailsCacheBuilder() {
        return Caffeine.newBuilder()
                .recordStats()
                .expireAfterWrite(USER_INACTIVITY_MINUTES, TimeUnit.MINUTES)
                .removalListener((key, value, cause) -> {
                    if (cause.wasEvicted() && key instanceof String email) {
                        logger.info("User {} marked inactive due to cache eviction", email);
                        userActivityService.markUserInactive(email);
                        userActivityService.broadcastUpdates();
                    }
                });
    }

    // Create cache builder for last seen with custom removal listener
    private Caffeine<Object, Object> createLastSeenCacheBuilder() {
        return Caffeine.newBuilder()
                .recordStats()
                .expireAfterWrite(USER_INACTIVITY_MINUTES, TimeUnit.MINUTES)
                .removalListener((key, value, cause) -> {
                    if (cause.wasEvicted() && key instanceof String email) {
                        logger.info("User {} marked inactive due to cache eviction", email);
                        userActivityService.markUserInactive(email);
                        userActivityService.broadcastUpdates();
                    }
                });
    }

    // Admin related caches
    @Bean
    public Cache<AdminCacheKey, AdminProfileResponseDTO> adminCache() {
        return createStandardBuilder()
                .maximumSize(STANDARD_CACHE_SIZE)
                .build();
    }

    @Bean
    public Cache<AdminCacheKey, List<AdminProfileSummaryResponseDTO>> adminListCache() {
        return createListBuilder()
                .maximumSize(SMALL_CACHE_SIZE)
                .build();
    }

    @Bean
    public Cache<Integer, AdminSettingsResponseDTO> adminSettingsCache() {
        return createStandardBuilder()
                .maximumSize(STANDARD_CACHE_SIZE)
                .build();
    }

    @Bean
    public Cache<AppointmentCacheKey, AppointmentResponseDTO> appointmentCache() {
        return createListBuilder()
                .maximumSize(STANDARD_CACHE_SIZE)
                .build();
    }


    // Emergency helpline caches
    @Bean
    public Cache<EmergencyHelplineCacheKey, EmergencyHelplineDTO> emergencyHelplineCache() {
        return createListBuilder()
                .maximumSize(STANDARD_CACHE_SIZE)
                .build();
    }

    @Bean
    public Cache<EmergencyHelplineCacheKey, List<EmergencyHelplineDTO>> emergencyHelplineListCache() {
        return createListBuilder()
                .maximumSize(SMALL_CACHE_SIZE)
                .build();
    }

    // Session related caches
    @Bean
    public Cache<SessionCacheKey, SessionResponseDTO> sessionCache() {
        return createStandardBuilder()
                .maximumSize(STANDARD_CACHE_SIZE)
                .build();
    }


    @Bean
    public Cache<Integer, Session> ongoingSessionsCache() {
        return createBaseBuilder()
                .expireAfterWrite(1, TimeUnit.HOURS)
                .maximumSize(STANDARD_CACHE_SIZE)
                .build();
    }

    // Chat and metrics caches
    @Bean
    public Cache<SessionCacheKey, List<ChatMessageDTO>> chatMessageCache() {
        return createListBuilder()
                .maximumSize(STANDARD_CACHE_SIZE)
                .build();
    }

    @Bean
    public Cache<SessionCacheKey, String> metricsCache() {
        return createListBuilder()
                .maximumSize(1)
                .build();
    }

    // Session feedback caches
    @Bean
    public Cache<SessionFeedbackCacheKey, SessionFeedbackResponseDTO> feedbackCache() {
        return createStandardBuilder()
                .maximumSize(STANDARD_CACHE_SIZE)
                .build();
    }

    @Bean
    public Cache<SessionFeedbackCacheKey, List<SessionFeedbackResponseDTO>> feedbackListCache() {
        return createListBuilder()
                .maximumSize(SMALL_CACHE_SIZE)
                .build();
    }

    @Bean
    public Cache<SessionFeedbackCacheKey, SessionFeedbackSummaryResponseDTO> feedbackSummaryCache() {
        return Caffeine.newBuilder()
                .recordStats()
                .maximumSize(TINY_CACHE_SIZE)
                .build();
    }
    // Session report caches
    @Bean
    public Cache<SessionReportCacheKey, SessionReportResponseDTO> sessionReportCache() {
        return createStandardBuilder()
                .maximumSize(STANDARD_CACHE_SIZE)
                .build();
    }

    @Bean
    public Cache<SessionReportCacheKey, List<SessionReportResponseDTO>> sessionReportListCache() {
        return createListBuilder()
                .maximumSize(SMALL_CACHE_SIZE)
                .build();
    }

    @Bean
    public Cache<SessionReportCacheKey, SessionReportSummaryResponseDTO> sessionReportSummaryCache() {
        return createListBuilder()
                .maximumSize(SMALL_CACHE_SIZE)
                .build();
    }

    // Listener related caches
    @Bean
    public Cache<ListenerApplicationCacheKey, ListenerApplicationResponseDTO> listenerApplicationCache() {
        return createStandardBuilder()
                .maximumSize(STANDARD_CACHE_SIZE)
                .build();
    }

    @Bean
    public Cache<ListenerApplicationCacheKey, List<ListenerApplicationSummaryResponseDTO>> listenerApplicationListCache() {
        return createListBuilder()
                .maximumSize(SMALL_CACHE_SIZE)
                .build();
    }

    @Bean
    public Cache<ListenerApplicationCacheKey, ListenerDetailsResponseDTO> listenerDetailsFromListenerApplicationCache() {
        return createStandardBuilder()
                .maximumSize(STANDARD_CACHE_SIZE)
                .build();
    }

    // User related caches
    @Bean
    public Cache<String, UserActivityDTO> userDetailsCache() {
        return createUserDetailsCacheBuilder()
                .maximumSize(MEDIUM_CACHE_SIZE)
                .build();
    }

    @Bean
    public Cache<String, LocalDateTime> lastSeenCache() {
        return createLastSeenCacheBuilder()
                .maximumSize(LARGE_CACHE_SIZE)
                .build();
    }

    @Bean
    public Cache<String, List<UserActivityDTO>> roleBasedDetailsCache() {
        return createBaseBuilder()
                .expireAfterWrite(USER_INACTIVITY_MINUTES, TimeUnit.MINUTES)
                .maximumSize(MEDIUM_CACHE_SIZE)
                .build();
    }

    @Bean
    public Cache<Integer, Integer> currentlyInSessionCache() {
        return createBaseBuilder()
                .expireAfterWrite(USER_INACTIVITY_MINUTES, TimeUnit.MINUTES)
                .maximumSize(LARGE_CACHE_SIZE)
                .build();
    }
    @Bean
    public Cache<String, LocalDateTime> blogViewCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(10, TimeUnit.MINUTES)  // 10 minute cooldown
                .maximumSize(10000)  // Adjust based on your needs
                .recordStats()
                .build();
    }

    @Bean
    public Cache<AppointmentCacheKey, List<AppointmentSummaryResponseDTO>> appointmentListCache() {
        return createListBuilder()
                .maximumSize(SMALL_CACHE_SIZE)
                .build();
    }
}