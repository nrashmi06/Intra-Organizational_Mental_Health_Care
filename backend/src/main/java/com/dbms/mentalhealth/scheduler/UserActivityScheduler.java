package com.dbms.mentalhealth.scheduler;

import com.dbms.mentalhealth.service.UserActivityService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.util.List;
import java.util.logging.Logger;

@Component
public class UserActivityScheduler {
    UserActivityService userActivityService;
    Logger logger = Logger.getLogger(UserActivityScheduler.class.getName());
    public UserActivityScheduler(UserActivityService userActivityService) {
        this.userActivityService = userActivityService;
    }
    @Scheduled(fixedRate = 5000) // 30 seconds
    public void cleanupExpiredUsers() {
        logger.info("Cleaning up expired users");
        List<String> expiredUsers = userActivityService.findExpiredUsers();
        logger.info("Expired users: " + expiredUsers);
        expiredUsers.forEach(userActivityService::markUserInactive);

    }
}