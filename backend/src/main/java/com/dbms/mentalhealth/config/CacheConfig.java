package com.dbms.mentalhealth.config;

import com.dbms.mentalhealth.dto.UserActivity.UserActivityDTO;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

import java.time.LocalDateTime;
import java.util.List;
import java.util.concurrent.TimeUnit;

@Configuration
public class CacheConfig {

    private final CommonRemovalListener commonRemovalListener;

    public CacheConfig(@Lazy CommonRemovalListener commonRemovalListener) {
        this.commonRemovalListener = commonRemovalListener;
    }

    @Bean
    public Cache<String, UserActivityDTO> userDetailsCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(10, TimeUnit.SECONDS)
                .maximumSize(1000)
                .removalListener(commonRemovalListener)
                .build();
    }

    @Bean
    public Cache<String, List<UserActivityDTO>> roleBasedDetailsCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(10, TimeUnit.SECONDS)
                .maximumSize(1000)
                .removalListener(commonRemovalListener)
                .build();
    }

    @Bean
    public Cache<String, LocalDateTime> lastSeenCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(10, TimeUnit.SECONDS)
                .maximumSize(1000)
                .removalListener(commonRemovalListener)
                .build();
    }
}