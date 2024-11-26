package com.dbms.mentalhealth.config;

import com.dbms.mentalhealth.service.UserActivityService;
import com.github.benmanes.caffeine.cache.RemovalCause;
import com.github.benmanes.caffeine.cache.RemovalListener;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Component;

import java.util.logging.Logger;

@Component
public class CommonRemovalListener implements RemovalListener<String, Object> {

    private final UserActivityService userActivityService;
    Logger log = Logger.getLogger(CommonRemovalListener.class.getName());
    public CommonRemovalListener(@Lazy UserActivityService userActivityService) {
        this.userActivityService = userActivityService;
    }

    @Override
    public void onRemoval(String key, Object value, RemovalCause cause) {
        if (cause.wasEvicted()) {
            log.info("User with key {} was evicted from the cache");
            userActivityService.markUserInactive(key);
        }
    }
}