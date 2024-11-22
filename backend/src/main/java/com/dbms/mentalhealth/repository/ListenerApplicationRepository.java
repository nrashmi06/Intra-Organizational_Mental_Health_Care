package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.enums.ListenerApplicationStatus;
import com.dbms.mentalhealth.model.ListenerApplication;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ListenerApplicationRepository extends JpaRepository<ListenerApplication, Integer> {
    boolean existsByUserEmail(String userEmail);
    List<ListenerApplication> findByApplicationStatus(ListenerApplicationStatus status);
}