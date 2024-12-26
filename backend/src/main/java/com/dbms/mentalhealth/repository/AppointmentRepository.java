package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.enums.AppointmentStatus;
import com.dbms.mentalhealth.model.Admin;
import com.dbms.mentalhealth.model.Appointment;
import com.dbms.mentalhealth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    boolean existsByUserAndStatusNot(User user, AppointmentStatus status);
    List<Appointment> findByUser_UserId(Integer userId);
    List<Appointment> findByAdmin_AdminId(Integer adminId);
    List<Appointment> findByTimeSlot_DateBetween(LocalDate startDate, LocalDate endDate);
    List<Appointment> findByAdminAndTimeSlot_DateAndTimeSlot_StartTimeAfterOrTimeSlot_DateAfter(Admin admin, LocalDate date, LocalTime startTime, LocalDate nextDate);
    List<Appointment> findByAdminAndStatus(Admin admin, AppointmentStatus status);}
