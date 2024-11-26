package com.dbms.mentalhealth.scheduler;

import com.dbms.mentalhealth.service.UserActivityService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class UserActivityScheduler {

    private final UserActivityService userActivityService;

    public UserActivityScheduler(UserActivityService userActivityService) {
        this.userActivityService = userActivityService;
    }

    @Scheduled(fixedRate = 5 * 60 * 1000) // Run every 5 minutes
    public void checkInactiveUsers() {
        userActivityService.checkInactiveUsers();
    }
}