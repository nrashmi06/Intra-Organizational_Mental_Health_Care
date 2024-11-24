package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.model.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Integer> {
    boolean existsByDateAndStartTimeAndEndTimeAndAdmins_AdminId(LocalDate date, LocalTime startTime, LocalTime endTime, Integer adminId);
    List<TimeSlot> findByDateBetween(LocalDate startDate, LocalDate endDate);
    List<TimeSlot> findByAdmins_AdminId(Integer adminId);

}