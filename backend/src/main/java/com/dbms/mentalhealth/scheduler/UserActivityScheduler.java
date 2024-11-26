//package com.dbms.mentalhealth.scheduler;
//
//import com.dbms.mentalhealth.service.UserActivityService;
//import lombok.extern.slf4j.Slf4j;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Component;
//
//@Component
//@Slf4j
//public class UserActivityScheduler {
//
//    private final UserActivityService userActivityService;
//
//    public UserActivityScheduler(UserActivityService userActivityService) {
//        this.userActivityService = userActivityService;
//    }
//
//    @Scheduled(fixedRate = 60 * 1000) // Run every 1 minute
//    public void checkInactiveUsers() {
//        try {
//            log.info("Running inactive users check");
//            userActivityService.checkInactiveUsers();
//        } catch (Exception e) {
//            log.error("Error in checking inactive users", e);
//        }
//    }
//}