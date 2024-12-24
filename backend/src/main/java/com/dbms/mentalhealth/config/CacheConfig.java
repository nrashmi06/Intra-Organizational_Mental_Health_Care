package com.dbms.mentalhealth.config;

import com.dbms.mentalhealth.dto.Appointment.response.AppointmentResponseDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentSummaryResponseDTO;
import com.dbms.mentalhealth.dto.EmergencyHelpline.EmergencyHelplineDTO;
import com.dbms.mentalhealth.dto.Listener.response.ListenerDetailsResponseDTO;
import com.dbms.mentalhealth.dto.TimeSlot.response.TimeSlotResponseDTO;
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
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CacheConfig {
    private static final Logger logger = LoggerFactory.getLogger(CacheConfig.class);

    @Value("${cache.duration.minutes}")
    private Long cacheExpiry;

    @Bean
    public Cache<Integer, BlogResponseDTO> blogCache() {
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
    public Cache<Integer, List<TimeSlotResponseDTO>> timeSlotCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(100)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }

    @Bean
    public Cache<Integer, AppointmentResponseDTO> appointmentCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(100)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }

    @Bean
    public Cache<Integer, List<AppointmentSummaryResponseDTO>> appointmentListCache() {
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
    public Cache<Integer, SessionResponseDTO> sessionCache() {
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
    public Cache<Integer, List<ChatMessageDTO>> chatMessageCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(100)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }

    @Bean
    public Cache<String, String> averageSessionDurationCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(1)
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
                .maximumSize(2)
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
                .maximumSize(1)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }

    @Bean
    public Cache<Integer, ListenerApplicationResponseDTO> listenerApplicationCache() {
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
    public Cache<Integer, ListenerDetailsResponseDTO> listenerDetailsCache() {
        return Caffeine.newBuilder()
                .expireAfterAccess(cacheExpiry, TimeUnit.MINUTES)
                .maximumSize(100)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }
}