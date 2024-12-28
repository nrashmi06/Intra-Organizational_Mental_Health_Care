package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.Appointment.request.AppointmentRequestDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentResponseDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentSummaryResponseDTO;
import com.dbms.mentalhealth.exception.admin.AdminNotFoundException;
import com.dbms.mentalhealth.exception.appointment.AppointmentNotFoundException;
import com.dbms.mentalhealth.exception.appointment.PendingAppointmentException;
import com.dbms.mentalhealth.exception.timeslot.TimeSlotNotFoundException;
import com.dbms.mentalhealth.exception.user.UserNotFoundException;
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
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private static final Logger logger = LoggerFactory.getLogger(AppointmentServiceImpl.class);

    private final AppointmentRepository appointmentRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    public final JwtUtils jwtUtils;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository, JwtUtils jwtUtils, TimeSlotRepository timeSlotRepository, UserRepository userRepository, AdminRepository adminRepository) {
        this.appointmentRepository = appointmentRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
        this.jwtUtils = jwtUtils;
    }

    @Override
    @Transactional
    public AppointmentResponseDTO createAppointment(AppointmentRequestDTO appointmentRequestDTO) {
        try {
            logger.info("Creating appointment for user with ID: {}", jwtUtils.getUserIdFromContext());
            Integer userId = jwtUtils.getUserIdFromContext();
            User user = userRepository.findById(userId)
                    .orElseThrow(() -> new UserNotFoundException("User not found"));
            Admin admin = adminRepository.findById(appointmentRequestDTO.getAdminId())
                    .orElseThrow(() -> new AdminNotFoundException("Admin not found"));
            boolean hasPendingAppointment = appointmentRepository.existsByUserAndAdminAndStatus(user, admin, AppointmentStatus.REQUESTED);
            if (hasPendingAppointment) {
                logger.warn("User with ID: {} has a pending appointment", userId);
                throw new PendingAppointmentException("You have a pending appointment. Please wait for it to be processed.");
            }

            TimeSlot timeSlot = timeSlotRepository.findById(appointmentRequestDTO.getTimeSlotId())
                    .orElseThrow(() -> new TimeSlotNotFoundException("Time slot not found"));

            Appointment appointment = AppointmentMapper.toEntity(appointmentRequestDTO);
            appointment.setUser(user);
            appointment.setAdmin(admin);
            timeSlot.setIsAvailable(false);
            timeSlotRepository.save(timeSlot);
            appointment.setTimeSlot(timeSlot);
            Appointment savedAppointment = appointmentRepository.save(appointment);
            logger.info("Appointment created with ID: {}", savedAppointment.getAppointmentId());
            return AppointmentMapper.toDTO(savedAppointment);
        } catch (UserNotFoundException | AdminNotFoundException | TimeSlotNotFoundException | PendingAppointmentException e) {
            logger.error("Error creating appointment: {}", e.getMessage());
            throw e;
        } catch (Exception e) {
            logger.error("Unexpected error creating appointment", e);
            throw new RuntimeException("Unexpected error creating appointment", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentSummaryResponseDTO> getAppointmentsByUser(Integer userId) {
        Integer currentUserId = jwtUtils.getUserIdFromContext();
        boolean isAdmin = jwtUtils.isAdminFromContext();
        logger.info("Fetching appointments for user ID: {}", userId != null ? userId : currentUserId);

        if (userId != null && !isAdmin && !currentUserId.equals(userId)) {
            logger.warn("User with ID: {} attempted to view appointments of another user", currentUserId);
            throw new IllegalStateException("You can only view your own appointments.");
        }

        List<Appointment> appointments = appointmentRepository.findByUser_UserId(isAdmin ? userId : currentUserId);
        return appointments.stream()
                .map(AppointmentMapper::toSummaryDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentSummaryResponseDTO> getAppointmentsByAdmin(Integer userId, Integer adminId) {
        Integer adminUserId;
        List<Appointment> appointments;
        if (userId == null && adminId == null) {
            adminUserId = jwtUtils.getUserIdFromContext();
            adminId = adminRepository.findByUser_UserId(adminUserId)
                    .orElseThrow(() -> new AdminNotFoundException("Admin not found"))
                    .getAdminId();
            appointments = appointmentRepository.findByAdmin_AdminId(adminId);
        } else if (userId == null) {
            appointments = appointmentRepository.findByAdmin_AdminId(adminId);
        } else {
            adminId = adminRepository.findByUser_UserId(userId)
                    .orElseThrow(() -> new AdminNotFoundException("Admin not found"))
                    .getAdminId();
            appointments = appointmentRepository.findByAdmin_AdminId(adminId);
        }
        logger.info("Fetched appointments for admin ID: {}", adminId);
        return appointments.stream()
                .map(AppointmentMapper::toSummaryDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AppointmentResponseDTO getAppointmentById(Integer appointmentId) {
        Integer currentUserId = jwtUtils.getUserIdFromContext();
        boolean isAdmin = jwtUtils.isAdminFromContext();
        logger.info("Fetching appointment with ID: {}", appointmentId);
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException("Appointment not found"));

        if (!isAdmin && !currentUserId.equals(appointment.getUser().getUserId())) {
            logger.warn("User with ID: {} attempted to view appointment of another user", currentUserId);
            throw new IllegalStateException("You can only view your own appointments.");
        }
        return AppointmentMapper.toDTO(appointment);
    }

    @Override
    @Transactional
    public void updateAppointmentStatus(Integer appointmentId, String status, String cancellationReason) {
        logger.info("Updating status of appointment ID: {} to {}", appointmentId, status);
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException("Appointment not found"));

        AppointmentStatus newStatus;
        try {
            newStatus = AppointmentStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            logger.error("Invalid appointment status: {}", status);
            throw new IllegalStateException("Invalid appointment status.");
        }
        TimeSlot timeSlot = appointment.getTimeSlot();
        if (newStatus == AppointmentStatus.CONFIRMED) {
            appointment.setStatus(AppointmentStatus.CONFIRMED);
            timeSlot.setIsAvailable(false);
            timeSlotRepository.save(timeSlot);
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
        logger.info("Updated status of appointment ID: {} to {}", appointmentId, status);
    }

    @Override
    @Transactional
    public void cancelAppointment(Integer appointmentId, String cancellationReason) {
        logger.info("Cancelling appointment with ID: {}", appointmentId);
        Appointment appointment = appointmentRepository.findById(appointmentId)
                .orElseThrow(() -> new AppointmentNotFoundException("Appointment not found"));

        Integer currentUserId = jwtUtils.getUserIdFromContext();
        if (!currentUserId.equals(appointment.getUser().getUserId())) {
            logger.warn("User with ID: {} attempted to cancel appointment of another user", currentUserId);
            throw new IllegalStateException("You can only cancel your own appointments.");
        }

        appointment.setStatus(AppointmentStatus.CANCELLED);
        appointment.setCancellationReason(cancellationReason);

        TimeSlot timeSlot = appointment.getTimeSlot();
        timeSlot.setIsAvailable(true);
        timeSlotRepository.save(timeSlot);

        appointmentRepository.save(appointment);
        logger.info("Cancelled appointment with ID: {}", appointmentId);
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentSummaryResponseDTO> getAppointmentsByDateRange(LocalDate startDate, LocalDate endDate) {
        logger.info("Fetching appointments between dates: {} and {}", startDate, endDate);
        List<Appointment> appointments = appointmentRepository.findByTimeSlot_DateBetween(startDate, endDate);
        return appointments.stream()
                .map(AppointmentMapper::toSummaryDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public List<AppointmentSummaryResponseDTO> getUpcomingAppointmentsForAdmin() {
        Integer userId = jwtUtils.getUserIdFromContext();
        Admin admin = adminRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new AdminNotFoundException("Admin not found"));

        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        logger.info("Fetching upcoming appointments for admin ID: {}", admin.getAdminId());
        List<Appointment> appointments = appointmentRepository.findByAdminAndUpcomingAppointments(admin, today, now);

        return appointments.stream()
                .map(AppointmentMapper::toSummaryDTO)
                .toList();
    }


    @Override
    @Transactional(readOnly = true)
    public List<AppointmentSummaryResponseDTO> getAppointmentsByAdminStatus(String status) {
        try {
            if (status == null || status.isEmpty()) {
                logger.warn("Status cannot be null or empty");
                throw new IllegalArgumentException("Status cannot be null or empty");
            }

            AppointmentStatus appointmentStatus;
            try {
                appointmentStatus = AppointmentStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                logger.error("Invalid status: {}", status);
                throw new IllegalArgumentException("Invalid status: " + status, e);
            }

            Integer adminUserId = jwtUtils.getUserIdFromContext();
            Admin admin = adminRepository.findByUser_UserId(adminUserId)
                    .orElseThrow(() -> new AdminNotFoundException("Admin not found"));

            logger.info("Fetching appointments for admin ID: {} with status: {}", admin.getAdminId(), status);
            List<Appointment> appointments = appointmentRepository.findByAdminAndStatus(admin, appointmentStatus);

            return appointments.stream()
                    .map(AppointmentMapper::toSummaryDTO)
                    .toList();
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status, e);
        } catch (Exception e) {
            logger.error("An error occurred while fetching appointments by status", e);
            throw new RuntimeException("An error occurred while fetching appointments by status", e);
        }
    }
}