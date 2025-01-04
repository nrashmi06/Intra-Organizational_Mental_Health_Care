package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.model.UserMetrics;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface UserMetricsRepository extends JpaRepository<UserMetrics, Integer> {
    Optional<UserMetrics> findByUser_AnonymousName(String anonymousName);
    Optional<UserMetrics> findByUser_UserId(Integer userId);
    Optional<UserMetrics> findByUser(User user);
    @Modifying
    @Transactional
    @Query("UPDATE UserMetrics um SET um.totalMessagesSent = um.totalMessagesSent + :count " +
            "WHERE um.user.anonymousName = :anonymousName")
    void incrementMessageCount(@Param("anonymousName") String anonymousName, @Param("count") Integer count);
}
