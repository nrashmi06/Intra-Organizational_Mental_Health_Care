package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.model.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Integer> {
}