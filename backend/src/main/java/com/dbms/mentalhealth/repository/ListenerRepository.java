package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.model.Listener;
import com.dbms.mentalhealth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface ListenerRepository extends JpaRepository<Listener, Integer> {
    Optional<Listener> findByUser_UserId(Integer userId);
    Optional<Listener> findByUser(User user);
    boolean existsByUser(User user);
}
