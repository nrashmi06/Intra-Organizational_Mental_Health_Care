package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.model.TimeSlot;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface TimeSlotRepository extends JpaRepository<TimeSlot, Integer> {
    Optional<TimeSlot> findByDateAndStartTimeAndEndTimeAndAdmin_AdminId(LocalDate date, LocalTime startTime, LocalTime endTime, Integer adminId);
    List<TimeSlot> findByDateBetweenAndAdmin_AdminId(LocalDate startDate, LocalDate endDate, Integer adminId);
    List<TimeSlot> findByDateBetweenAndAdmin_AdminIdAndIsAvailable(LocalDate startDate, LocalDate endDate, Integer adminId, Boolean isAvailable);
    List<TimeSlot> findByDateAndAdmin_AdminId(LocalDate date, Integer adminId);
    Page<TimeSlot> findByAdmin_AdminId(Integer adminId, Pageable pageable);
    Page<TimeSlot> findByDateBetweenAndAdmin_AdminId(LocalDate startDate, LocalDate endDate, Integer adminId, Pageable pageable);
    Page<TimeSlot> findByDateBetweenAndAdmin_AdminIdAndIsAvailable(LocalDate startDate, LocalDate endDate, Integer adminId, Boolean isAvailable, Pageable pageable);
}