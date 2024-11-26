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
    public Caffeine<String, Object> caffeineConfig() {
        return Caffeine.newBuilder()
                .expireAfterWrite(1, TimeUnit.MINUTES)
                .maximumSize(1000)
                .removalListener(commonRemovalListener);
    }

    @Bean
    public Cache<String, UserActivityDTO> userDetailsCache(Caffeine<String, Object> caffeineConfig) {
        return caffeineConfig.build();
    }

    @Bean
    public Cache<String, List<UserActivityDTO>> roleBasedDetailsCache(Caffeine<String, Object> caffeineConfig) {
        return caffeineConfig.build();
    }

    @Bean
    public Cache<String, LocalDateTime> lastSeenCache(Caffeine<String, Object> caffeineConfig) {
        return caffeineConfig.build();
    }
}