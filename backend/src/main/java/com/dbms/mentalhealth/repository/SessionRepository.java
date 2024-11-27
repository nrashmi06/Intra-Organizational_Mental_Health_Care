package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.model.Session;
import org.springframework.data.jpa.repository.JpaRepository;

public interface SessionRepository extends JpaRepository<Session, Integer> {
}
