package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.enums.SessionStatus;
import com.dbms.mentalhealth.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, Integer> {
    Optional<Session> findByUser_UserIdAndListener_ListenerId(Integer userId, Integer listenerId);
    SessionStatus findSessionStatusBySessionId(Integer sessionId);
    List<Session> findByUser_UserId(Integer userId);
    List<Session> findBySessionStatus(SessionStatus sessionStatus);
    List<Session> findByListener_ListenerId(Integer listenerId);
    long countBySessionStatus(SessionStatus status);
}
