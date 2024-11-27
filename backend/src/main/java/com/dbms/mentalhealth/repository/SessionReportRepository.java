package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.model.SessionReport;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionReportRepository extends JpaRepository<SessionReport, Integer> {
}
