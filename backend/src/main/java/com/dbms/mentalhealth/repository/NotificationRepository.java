package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.model.Notification;
import jakarta.persistence.criteria.CriteriaBuilder;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NotificationRepository extends JpaRepository<Notification, Integer> {
}
