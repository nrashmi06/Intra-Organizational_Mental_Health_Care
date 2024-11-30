package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.model.UserMetrics;
import org.springframework.data.jpa.repository.JpaRepository;

public interface UserMetricsRepository extends JpaRepository<UserMetrics, Integer> {
}
