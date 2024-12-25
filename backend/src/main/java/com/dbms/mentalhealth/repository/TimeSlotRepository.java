package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.model.TimeSlot;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

public interface TimeSlotRepository extends JpaRepository<TimeSlot, Integer> {

    boolean existsByDateAndAdmin_AdminIdAndStartTimeLessThanAndEndTimeGreaterThan(
            LocalDate date, Integer adminId, LocalTime endTime, LocalTime startTime);

    boolean existsByDateAndAdmin_AdminIdAndStartTimeLessThanAndEndTimeGreaterThanAndTimeSlotIdNot(
            LocalDate date, Integer adminId, LocalTime endTime, LocalTime startTime, Integer timeSlotId);

    boolean existsByDateAndStartTimeAndEndTimeAndAdmin_AdminId(
            LocalDate date, LocalTime startTime, LocalTime endTime, Integer adminId);

    List<TimeSlot> findByDateBetweenAndAdmin_AdminId(
            LocalDate startDate, LocalDate endDate, Integer adminId);

    List<TimeSlot> findByDateBetweenAndAdmin_AdminIdAndIsAvailable(
            LocalDate startDate, LocalDate endDate, Integer adminId, Boolean isAvailable);
}