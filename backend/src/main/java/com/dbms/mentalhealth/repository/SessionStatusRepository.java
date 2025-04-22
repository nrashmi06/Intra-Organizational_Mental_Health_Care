package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.enums.SessionCategory;
import com.dbms.mentalhealth.model.SessionStatus;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SessionStatusRepository extends JpaRepository<SessionStatus, Integer> {
    List<SessionStatus> findByIsSessionStatusComputedFalse();
    List<SessionStatus> findByCategory(SessionCategory category);

    @Query("SELECT ss FROM SessionStatus ss WHERE ss.session.user.userId = :userId")
    List<SessionStatus> findBySessionUserId(@Param("userId") Long userId);
}