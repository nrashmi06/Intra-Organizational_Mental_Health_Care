package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.model.UserMetrics;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserMetricsRepository extends JpaRepository<UserMetrics, Integer> {
    Optional<UserMetrics> findByUser_AnonymousName(String anonymousName);
    Optional<UserMetrics> findByUser_UserId(Integer userId);
    Optional<UserMetrics> findByUser(User user);

}
