package com.dbms.mentalhealth.config;

import com.dbms.mentalhealth.dto.UserActivity.UserActivityDTO;
import com.dbms.mentalhealth.service.UserActivityService;
import com.github.benmanes.caffeine.cache.Cache;
import com.github.benmanes.caffeine.cache.RemovalCause;
import com.github.benmanes.caffeine.cache.RemovalListener;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

@Component
public class CommonRemovalListener implements RemovalListener<String, Object> {

    private final UserActivityService userActivityService;

    public CommonRemovalListener(@Lazy UserActivityService userActivityService) {
        this.userActivityService = userActivityService;
    }

    @Override
    public void onRemoval(String key, Object value, RemovalCause cause) {
        if (cause.wasEvicted()) {
            userActivityService.markUserInactive(key);
        }
    }
}