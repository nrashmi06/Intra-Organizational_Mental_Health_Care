package com.dbms.mentalhealth.config;
import com.dbms.mentalhealth.dto.TimeSlot.response.TimeSlotResponseDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogResponseDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogSummaryDTO;
import com.dbms.mentalhealth.dto.Admin.response.AdminProfileResponseDTO;
import com.dbms.mentalhealth.dto.Admin.response.AdminProfileSummaryResponseDTO;
import com.dbms.mentalhealth.dto.adminSettings.response.AdminSettingsResponseDTO;
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
}