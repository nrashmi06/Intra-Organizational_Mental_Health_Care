//package com.dbms.mentalhealth.scheduler;
//
//import com.dbms.mentalhealth.model.User;
//import com.dbms.mentalhealth.repository.UserRepository;
//import com.dbms.mentalhealth.security.jwt.JwtUtils;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Component;
//
//import java.time.LocalDateTime;
//import java.util.List;
//
//@Component
//public class UserActivityScheduler {
//
//    private final UserRepository userRepository;
//    private final JwtUtils jwtUtils;
//
//    public UserActivityScheduler(UserRepository userRepository, JwtUtils jwtUtils) {
//        this.userRepository = userRepository;
//        this.jwtUtils = jwtUtils;
//    }
//
//    @Scheduled(fixedRate = 300000) // 5 minutes in milliseconds
//    public void checkUserActivity() {
//        List<User> activeUsers = userRepository.findByIsActive(true);
//        for (User user : activeUsers) {
//            if (jwtUtils.isTokenExpired(user.getJwtToken())) {
//                user.setLastSeen(null);
//                userRepository.save(user);
//            }
//        }
//    }
//}