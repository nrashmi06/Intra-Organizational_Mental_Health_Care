package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.Appointment.request.AppointmentRequestDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentResponseDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentSummaryResponseDTO;
import com.dbms.mentalhealth.exception.AdminNotFoundException;
import com.dbms.mentalhealth.exception.AppointmentNotFoundException;
import com.dbms.mentalhealth.exception.TimeSlotNotFoundException;
import com.dbms.mentalhealth.exception.UserNotFoundException;
import com.dbms.mentalhealth.mapper.AppointmentMapper;
import com.dbms.mentalhealth.model.Appointment;
import com.dbms.mentalhealth.model.TimeSlot;
import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.model.Admin;
import com.dbms.mentalhealth.repository.AppointmentRepository;
import com.dbms.mentalhealth.repository.TimeSlotRepository;
import com.dbms.mentalhealth.repository.UserRepository;
import com.dbms.mentalhealth.repository.AdminRepository;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.AppointmentService;
import com.dbms.mentalhealth.enums.AppointmentStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.sql.Time;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private final AppointmentRepository appointmentRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    public final JwtUtils jwtUtils;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository,JwtUtils jwtUtils , TimeSlotRepository timeSlotRepository, UserRepository userRepository, AdminRepository adminRepository) {
        this.appointmentRepository = appointmentRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
        this.jwtUtils = jwtUtils;
    }

    @Override
    public AppointmentResponseDTO createAppointment(AppointmentRequestDTO appointmentRequestDTO) {
        Integer UserId = jwtUtils.getUserIdFromContext();
        User user = userRepository.findById(UserId)
                .orElseThrow(() -> new UserNotFoundException("User not found"));
        Admin admin = adminRepository.findById(appointmentRequestDTO.getAdminId())
                .orElseThrow(() -> new AdminNotFoundException("Admin not found"));
        TimeSlot timeSlot = timeSlotRepository.findById(appointmentRequestDTO.getTimeSlotId())
                .orElseThrow(() -> new TimeSlotNotFoundException("Time slot not found"));

        boolean hasUnapprovedAppointment = appointmentRepository.existsByUserAndStatusNot(user, AppointmentStatus.CONFIRMED);
        if (hasUnapprovedAppointment) {
            throw new IllegalStateException("You have already submitted an appointment that is not approved. Please cancel it or wait for approval.");
        }

        Appointment appointment = AppointmentMapper.toEntity(appointmentRequestDTO);
        appointment.setUser(user);
        appointment.setAdmin(admin);
        timeSlot.setIsAvailable(false);
        timeSlotRepository.save(timeSlot);
        appointment.setTimeSlot(timeSlot);
        Appointment savedAppointment = appointmentRepository.save(appointment);
        return AppointmentMapper.toDTO(savedAppointment);
    }
    @Override
    public List<AppointmentSummaryResponseDTO> getAppointmentsByUser(Integer userId) {
        Integer currentUserId = jwtUtils.getUserIdFromContext(); // Assuming user ID is stored in the authentication name
        boolean isAdmin = jwtUtils.isAdminFromContext();

        if (userId != null && !isAdmin && !currentUserId.equals(userId)) {
            throw new IllegalStateException("You can only view your own appointments.");
        }
        //basically if any id is not passed in req param it means this method is called by user itself
        //if id is passed in req param then it means this method is called by admin
        List<Appointment> appointments = appointmentRepository.findByUser_UserId(isAdmin ? userId : currentUserId);
        return appointments.stream()
                .map(AppointmentMapper::toSummaryDTO)
                .toList();
    }

    @Override
    public List<AppointmentSummaryResponseDTO> getAppointmentsByAdmin(Integer userId) {
        Integer adminId;
        if (userId == null) {
            adminId = jwtUtils.getUserIdFromContext(); // Get the current admin's ID from the JWT token
        } else {
            adminId = adminRepository.findByUser_UserId(userId)
                    .orElseThrow(() -> new AdminNotFoundException("Admin not found"))
                    .getAdminId();
        }
        List<Appointment> appointments = appointmentRepository.findByAdmin_AdminId(adminId);
        return appointments.stream()
                .map(AppointmentMapper::toSummaryDTO)
                .toList();
    }

    // In AppointmentServiceImpl.java
    @Override
    public AppointmentResponseDTO getAppointmentById(Integer appointmentId) {
        Integer currentUserId = jwtUtils.getUserIdFromContext(); // Assuming user ID is stored in the authentication name
        boolean isAdmin = jwtUtils.isAdminFromContext();
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException("Appointment not found"));

        if (!isAdmin && !currentUserId.equals(appointment.getUser().getUserId())) {
            throw new IllegalStateException("You can only view your own appointments.");
        }
        //this ensures that user can only view his own appointments
        //but admin can view any appointment
        return AppointmentMapper.toDTO(appointment);
    }

    @Override
    public void updateAppointmentStatus(Integer appointmentId, String status, String cancellationReason) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException("Appointment not found"));

        AppointmentStatus newStatus;
        try {
            newStatus = AppointmentStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalStateException("Invalid appointment status.");
        }
        TimeSlot timeSlot = appointment.getTimeSlot();
        if (newStatus == AppointmentStatus.CONFIRMED) {
            appointment.setStatus(AppointmentStatus.CONFIRMED);
            timeSlot.setIsAvailable(false);
        } else if (newStatus == AppointmentStatus.CANCELLED) {
            timeSlot.setIsAvailable(true);
            timeSlotRepository.save(timeSlot);
            appointment.setStatus(AppointmentStatus.CANCELLED);
        }

        if (newStatus == AppointmentStatus.CANCELLED) {
            appointment.setCancellationReason(cancellationReason);
        } else {
            appointment.setCancellationReason(null);
        }
        appointmentRepository.save(appointment);
    }

    @Override
    public void cancelAppointment(Integer appointmentId, String cancellationReason) {
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException("Appointment not found"));

        Integer currentUserId = jwtUtils.getUserIdFromContext();
        if (!currentUserId.equals(appointment.getUser().getUserId())) {
            throw new IllegalStateException("You can only cancel your own appointments.");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointment.setCancellationReason(cancellationReason);

        TimeSlot timeSlot = appointment.getTimeSlot();
        timeSlot.setIsAvailable(true);
        timeSlotRepository.save(timeSlot);

        appointmentRepository.save(appointment);
    }
}