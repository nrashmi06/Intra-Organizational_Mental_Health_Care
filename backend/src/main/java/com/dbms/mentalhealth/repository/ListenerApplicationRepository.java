package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.enums.ListenerApplicationStatus;
import com.dbms.mentalhealth.model.ListenerApplication;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ListenerApplicationRepository extends JpaRepository<ListenerApplication, Integer> {
    boolean existsByUserEmail(String userEmail);
    Page<ListenerApplication> findByApplicationStatus(ListenerApplicationStatus status, Pageable pageable);
    ListenerApplication findByUser_UserId(Integer listenerId);
}