package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.model.Listener;
import com.dbms.mentalhealth.model.User;
import jakarta.transaction.Transactional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface ListenerRepository extends JpaRepository<Listener, Integer> {
    Optional<Listener> findByUser_UserId(Integer userId);
    Optional<Listener> findByUser(User user);
    boolean existsByUser(User user);
    @Modifying
    @Transactional
    @Query("UPDATE Listener l SET l.totalMessagesSent = l.totalMessagesSent + 1 WHERE l.user.anonymousName = :anonymousName")
    void incrementMessageCount(@Param("anonymousName") String anonymousName);
}
