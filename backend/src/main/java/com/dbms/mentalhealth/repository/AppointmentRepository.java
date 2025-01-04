package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.enums.AppointmentStatus;
import com.dbms.mentalhealth.model.Admin;
import com.dbms.mentalhealth.model.Appointment;
import com.dbms.mentalhealth.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {

    List<Appointment> findByUser_UserId(Integer userId);

    List<Appointment> findByAdmin_AdminId(Integer adminId);
    List<Appointment> findByAdminAndStatus(Admin admin, AppointmentStatus status);

    boolean existsByUserAndAdminAndStatus(User user, Admin admin, AppointmentStatus status);
    @Query("""
    SELECT a FROM Appointment a
    WHERE a.admin = :admin AND a.timeSlot.date BETWEEN :startDate AND :endDate
    """)
    Page<Appointment> findByTimeSlot_DateBetween(
            @Param("admin") Admin admin,
            @Param("startDate") LocalDate startDate,
            @Param("endDate") LocalDate endDate,
            Pageable pageable
    );


    @Query("""
            SELECT a FROM Appointment a
            WHERE a.admin = :admin
            AND (
                a.timeSlot.date > :today
                OR (a.timeSlot.date = :today AND a.timeSlot.startTime > :now)
            )
            AND (:status IS NULL OR a.status = :status)
            ORDER BY a.timeSlot.date ASC, a.timeSlot.startTime ASC
            """)
    Page<Appointment> findUpcomingAppointments(
            @Param("admin") Admin admin,
            @Param("today") LocalDate today,
            @Param("now") LocalTime now,
            @Param("status") AppointmentStatus status,
            Pageable pageable
    );

    @Query("""
            SELECT a FROM Appointment a
            WHERE a.admin = :admin
            AND (
                a.timeSlot.date < :today
                OR (a.timeSlot.date = :today AND a.timeSlot.startTime <= :now)
            )
            AND (:status IS NULL OR a.status = :status)
            ORDER BY a.timeSlot.date DESC, a.timeSlot.startTime DESC
            """)
    Page<Appointment> findPastAppointments(
            @Param("admin") Admin admin,
            @Param("today") LocalDate today,
            @Param("now") LocalTime now,
            @Param("status") AppointmentStatus status,
            Pageable pageable
    );
}
