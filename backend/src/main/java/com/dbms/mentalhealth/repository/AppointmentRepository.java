package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.enums.AppointmentStatus;
import com.dbms.mentalhealth.model.Appointment;
import com.dbms.mentalhealth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AppointmentRepository extends JpaRepository<Appointment, Integer> {
    boolean existsByUserAndStatusNot(User user, AppointmentStatus status);
    List<Appointment> findByUser_UserId(Integer userId);
    List<Appointment> findByAdmin_AdminId(Integer adminId);
}