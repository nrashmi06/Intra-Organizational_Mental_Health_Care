package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.model.SessionFeedback;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SessionFeedbackRepository extends JpaRepository<SessionFeedback, Integer> {
    List<SessionFeedback> findBySession_SessionId(Integer sessionId);
    List<SessionFeedback> findByListener_ListenerId(Integer listenerId);
}
