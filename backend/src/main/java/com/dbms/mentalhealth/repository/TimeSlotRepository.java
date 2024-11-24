package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.model.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Integer> {
   boolean existsByDateAndAdmins_AdminIdAndStartTimeLessThanAndEndTimeGreaterThan(LocalDate date, Integer adminId, LocalTime endTime, LocalTime startTime);
    boolean existsByDateAndStartTimeAndEndTimeAndAdmins_AdminId(LocalDate date, LocalTime startTime, LocalTime endTime, Integer adminId);
    List<TimeSlot> findByDateBetweenAndAdmins_AdminId(LocalDate startDate, LocalDate endDate, Integer adminId);
    List<TimeSlot> findByDateBetweenAndAdmins_AdminIdAndIsAvailable(LocalDate startDate, LocalDate endDate, Integer adminId, Boolean isAvailable);
    boolean existsByDateAndAdmins_AdminIdAndStartTimeLessThanAndEndTimeGreaterThanAndTimeSlotIdNot(
            LocalDate date, Integer adminId, LocalTime startTime, LocalTime endTime, Integer idNot);



}