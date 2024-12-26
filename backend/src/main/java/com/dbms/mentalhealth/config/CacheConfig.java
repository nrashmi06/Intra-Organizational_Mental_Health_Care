package com.dbms.mentalhealth.config;

import com.dbms.mentalhealth.dto.Appointment.response.AppointmentResponseDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentSummaryResponseDTO;
import com.dbms.mentalhealth.dto.EmergencyHelpline.EmergencyHelplineDTO;
import com.dbms.mentalhealth.dto.Listener.response.ListenerDetailsResponseDTO;
import com.dbms.mentalhealth.dto.TimeSlot.response.TimeSlotResponseDTO;
import com.dbms.mentalhealth.dto.UserActivity.UserActivityDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogResponseDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogSummaryDTO;
import com.dbms.mentalhealth.dto.Admin.response.AdminProfileResponseDTO;
import com.dbms.mentalhealth.dto.Admin.response.AdminProfileSummaryResponseDTO;
import com.dbms.mentalhealth.dto.adminSettings.response.AdminSettingsResponseDTO;
import com.dbms.mentalhealth.dto.chatMessage.ChatMessageDTO;
import com.dbms.mentalhealth.dto.listenerApplication.response.ListenerApplicationResponseDTO;
import com.dbms.mentalhealth.dto.listenerApplication.response.ListenerApplicationSummaryResponseDTO;
import com.dbms.mentalhealth.dto.session.SessionResponseDTO;
import com.dbms.mentalhealth.dto.session.SessionSummaryDTO;
import com.dbms.mentalhealth.dto.session.response.SessionReportResponseDTO;
import com.dbms.mentalhealth.dto.session.response.SessionReportSummaryResponseDTO;
import com.dbms.mentalhealth.dto.sessionFeedback.response.SessionFeedbackResponseDTO;
import com.dbms.mentalhealth.dto.sessionFeedback.response.SessionFeedbackSummaryResponseDTO;
import com.dbms.mentalhealth.model.Session;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;
import java.util.concurrent.atomic.AtomicLong;

@Configuration
@EnableCaching
public class CacheConfig {
    private static final Logger logger = LoggerFactory.getLogger(CacheConfig.class);

    @Value("${cache.duration.minutes}")
    private Long cacheExpiry;

    @Bean
    public Cache<String, BlogResponseDTO> blogCache() {
        return Caffeine.newBuilder()
                .expireAfterAccess(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(100)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }

    @Bean
    public Cache<String, List<BlogSummaryDTO>> blogListCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(50)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }
    @Bean
    public Cache<Integer, AtomicLong> viewCountCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(10000)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }

    @Bean
    public Cache<String, Boolean> recentViewCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(10, TimeUnit.MINUTES)
                .maximumSize(10000)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }
    @Bean
    public Cache<Integer, AdminProfileResponseDTO> adminCache() {
        return Caffeine.newBuilder()
                .expireAfterAccess(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(100)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }

    @Bean
    public Cache<String, List<AdminProfileSummaryResponseDTO>> adminListCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(50)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }

    @Bean
    public Cache<Integer, AdminSettingsResponseDTO> adminSettingsCache() {
        return Caffeine.newBuilder()
                .expireAfterAccess(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(100)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }
    @Bean
    public Cache<String, TimeSlotResponseDTO> individualTimeSlotCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(100)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }
    @Bean
    public Cache<String, List<TimeSlotResponseDTO>> timeSlotCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(100)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }

    @Bean
    public Cache<String, AppointmentResponseDTO> appointmentCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(100)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }

    @Bean
    public Cache<String, List<AppointmentSummaryResponseDTO>> appointmentListCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(100)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }

    @Bean
    public Cache<Integer, EmergencyHelplineDTO> emergencyHelplineCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(100)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }

    @Bean
    public Cache<Integer, List<EmergencyHelplineDTO>> emergencyHelplineListCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(50)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }

    @Bean
    public Cache<String, SessionResponseDTO> sessionCache() {
        return Caffeine.newBuilder()
                .expireAfterAccess(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(100)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }

    @Bean
    public Cache<String, List<SessionSummaryDTO>> sessionListCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(50)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }

    @Bean
    public Cache<String, List<ChatMessageDTO>> chatMessageCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(100)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }

    @Bean
    public Cache<String, String> metricsCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(10)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }

    @Bean
    public Cache<Integer, SessionFeedbackResponseDTO> sessionFeedbackCache() {
        return Caffeine.newBuilder()
                .expireAfterAccess(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(100)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }

    @Bean
    public Cache<String, List<SessionFeedbackResponseDTO>> sessionFeedbackListCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(50)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }

    @Bean
    public Cache<String, SessionFeedbackSummaryResponseDTO> sessionFeedbackSummaryCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(10)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }

    @Bean
    public Cache<Integer, SessionReportResponseDTO> sessionReportCache() {
        return Caffeine.newBuilder()
                .expireAfterAccess(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(100)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }

    @Bean
    public Cache<String, List<SessionReportResponseDTO>> sessionReportListCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(50)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }

    @Bean
    public Cache<String, SessionReportSummaryResponseDTO> sessionReportSummaryCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(50)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }

    @Bean
    public Cache<String, ListenerApplicationResponseDTO> listenerApplicationCache() {
        return Caffeine.newBuilder()
                .expireAfterAccess(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(100)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }

    @Bean
    public Cache<String, List<ListenerApplicationSummaryResponseDTO>> listenerApplicationListCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(50)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }

    @Bean
    public Cache<String, ListenerDetailsResponseDTO> listenerDetailsCache() {
        return Caffeine.newBuilder()
                .expireAfterAccess(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(100)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }

    @Bean
    public Cache<String, List<UserActivityDTO>> listenerListCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(50)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }

    @Bean
    public Cache<Integer, Session> ongoingSessionsCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(1, TimeUnit.HOURS)
                .maximumSize(100)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }

    @Bean
    public Cache<String, UserActivityDTO> userDetailsCache() {
        return Caffeine.newBuilder()
                .expireAfterAccess(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(500)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }

    @Bean
    public Cache<String, List<UserActivityDTO>> roleBasedDetailsCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(200)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }

    @Bean
    public Cache<String, LocalDateTime> lastSeenCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(1000)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }
}