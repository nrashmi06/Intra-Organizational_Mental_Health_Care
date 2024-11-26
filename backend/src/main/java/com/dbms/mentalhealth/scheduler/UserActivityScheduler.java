package com.dbms.mentalhealth.scheduler;

import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.repository.UserRepository;
import com.dbms.mentalhealth.service.UserActivityService;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.util.List;

@Component
public class UserActivityScheduler {

    private final UserRepository userRepository;
    private final UserActivityService userActivityService;

    public UserActivityScheduler(UserRepository userRepository, UserActivityService userActivityService) {
        this.userRepository = userRepository;
        this.userActivityService = userActivityService;
    }

    @Scheduled(fixedRate = 5 * 60 * 1000) // Run every 5 minutes
    public void checkInactiveUsers() {
        LocalDateTime fiveMinutesAgo = LocalDateTime.now().minusMinutes(5);
        List<User> users = userRepository.findByIsActiveTrue();
        for (User user : users) {
            if (user.getLastSeen() != null && user.getLastSeen().isBefore(fiveMinutesAgo)) {
                user.setIsActive(false);
                userRepository.save(user);
                userActivityService.broadcastAllUsers();
                userActivityService.broadcastRoleCounts();
                userActivityService.broadcastAdminDetails();
                userActivityService.broadcastListenerDetails();
                userActivityService.broadcastUserDetails();
            }
        }
    }
}