package com.dbms.mentalhealth.config;

import com.dbms.mentalhealth.dto.blog.response.BlogResponseDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogSummaryDTO;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.EnableCaching;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import java.util.List;
import java.util.concurrent.TimeUnit;

@Configuration
@EnableCaching
public class CacheConfig {
    private static final Logger logger = LoggerFactory.getLogger(CacheConfig.class);

    @Bean
    public com.github.benmanes.caffeine.cache.Cache<Integer, BlogResponseDTO> blogCache() {
        return Caffeine.newBuilder()
                .expireAfterAccess(1, TimeUnit.MINUTES)  // Expire after 1 minute of inactivity
                .maximumSize(100)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats()
                .build();
    }

    @Bean
    public com.github.benmanes.caffeine.cache.Cache<String, List<BlogSummaryDTO>> blogListCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(1, TimeUnit.MINUTES)
                .maximumSize(50)
                .removalListener((key, value, cause) ->
                        logger.info(String.format("Key %s was removed (%s)", key, cause)))
                .recordStats() // Enable statistics recording
                .build();
    }
}