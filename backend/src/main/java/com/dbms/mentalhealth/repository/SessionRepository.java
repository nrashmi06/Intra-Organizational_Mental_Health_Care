package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.enums.SessionStatus;
import com.dbms.mentalhealth.model.Session;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
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
    Page<Session> findByUser_UserId(Integer userId, Pageable pageable);
    Page<Session> findByListener_ListenerId(Integer listenerId, Pageable pageable);
    Page<Session> findBySessionStatus(SessionStatus sessionStatus, Pageable pageable);
    Page<Session> findByUser_UserIdAndSessionStatus(Integer userId, SessionStatus sessionStatus, Pageable pageable);
    Page<Session> findByListener_ListenerIdAndSessionStatus(Integer listenerId, SessionStatus sessionStatus, Pageable pageable);
}
