package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.enums.SessionActivityStatus;
import com.dbms.mentalhealth.model.Session;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface SessionRepository extends JpaRepository<Session, Integer> {
    Optional<Session> findByUser_UserIdAndListener_ListenerId(Integer userId, Integer listenerId);
    SessionActivityStatus findSessionStatusBySessionId(Integer sessionId);
    List<Session> findByUser_UserId(Integer userId);
    List<Session> findBySessionStatus(SessionActivityStatus sessionStatus);
    List<Session> findByListener_ListenerId(Integer listenerId);
    long countBySessionStatus(SessionActivityStatus status);
    Page<Session> findByUser_UserId(Integer userId, Pageable pageable);
    Page<Session> findByListener_ListenerId(Integer listenerId, Pageable pageable);
    Page<Session> findBySessionStatus(SessionActivityStatus sessionStatus, Pageable pageable);
    Page<Session> findByUser_UserIdAndSessionStatus(Integer userId, SessionActivityStatus sessionStatus, Pageable pageable);
    Page<Session> findByListener_ListenerIdAndSessionStatus(Integer listenerId, SessionActivityStatus sessionStatus, Pageable pageable);
}
