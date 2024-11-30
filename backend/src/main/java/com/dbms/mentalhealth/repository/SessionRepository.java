package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, Integer> {
    Optional<Session> findByUser_UserIdAndListener_ListenerId(Integer userId, Integer listenerId);
}
