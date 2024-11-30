package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.model.SessionFeedback;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionFeedbackRepository extends JpaRepository<SessionFeedback, Integer> {
}
