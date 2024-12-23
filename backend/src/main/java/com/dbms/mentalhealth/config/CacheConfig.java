package com.dbms.mentalhealth.config;

import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.Caffeine;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Lazy;

import java.util.concurrent.TimeUnit;

@Configuration
public class CacheConfig {

    private final CommonRemovalListener commonRemovalListener;

    @Value("${cache.duration.minutes:5}")
    private Integer duration;

    public CacheConfig(@Lazy CommonRemovalListener commonRemovalListener) {
        this.commonRemovalListener = commonRemovalListener;
    }

    @Bean
    public Cache<String, Object> blogCache() {
        return Caffeine.newBuilder()
                .expireAfterWrite(duration, TimeUnit.MINUTES)
                .maximumSize(1000)
                .removalListener(commonRemovalListener)
                .recordStats()
                .build();
    }
}