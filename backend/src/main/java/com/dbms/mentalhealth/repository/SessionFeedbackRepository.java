package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.model.Listener;
import com.dbms.mentalhealth.model.SessionFeedback;
import com.dbms.mentalhealth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface SessionFeedbackRepository extends JpaRepository<SessionFeedback, Integer> {
    List<SessionFeedback> findBySession_SessionId(Integer sessionId);
    List<SessionFeedback> findByListener_ListenerId(Integer listenerId);
    List<SessionFeedback> findByUser_UserId(Integer userId);
    List<SessionFeedback> findByUser(User user);
    List<SessionFeedback> findByListener(Listener listener);
}
