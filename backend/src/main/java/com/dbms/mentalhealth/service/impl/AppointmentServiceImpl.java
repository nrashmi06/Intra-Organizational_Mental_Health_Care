package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.Appointment.request.AppointmentRequestDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentResponseDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentSummaryResponseDTO;
import com.dbms.mentalhealth.enums.AppointmentTimeFilter;
import com.dbms.mentalhealth.exception.admin.AdminNotFoundException;
import com.dbms.mentalhealth.exception.appointment.AppointmentNotFoundException;
import com.dbms.mentalhealth.exception.appointment.PendingAppointmentException;
import com.dbms.mentalhealth.exception.timeslot.TimeSlotNotFoundException;
import com.dbms.mentalhealth.exception.token.UnauthorizedException;
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
import com.dbms.mentalhealth.service.EmailService;
import com.dbms.mentalhealth.service.UserMetricService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.LocalTime;
import java.util.List;

@Service
public class AppointmentServiceImpl implements AppointmentService {

    private static final Logger logger = LoggerFactory.getLogger(AppointmentServiceImpl.class);

    private final AppointmentRepository appointmentRepository;
    private final TimeSlotRepository timeSlotRepository;
    private final UserRepository userRepository;
    private final AdminRepository adminRepository;
    public final JwtUtils jwtUtils;
    public final UserMetricService userMetricsService;
    public final EmailService emailService;

    public AppointmentServiceImpl(AppointmentRepository appointmentRepository,
                                  JwtUtils jwtUtils,
                                  TimeSlotRepository timeSlotRepository,
                                  UserRepository userRepository,
                                  AdminRepository adminRepository,
                                    UserMetricService userMetricsService,
                                  EmailService emailService) {
        this.appointmentRepository = appointmentRepository;
        this.timeSlotRepository = timeSlotRepository;
        this.userRepository = userRepository;
        this.adminRepository = adminRepository;
        this.jwtUtils = jwtUtils;
        this.userMetricsService = userMetricsService;
        this.emailService = emailService;
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
            LocalDateTime appointmentTime = timeSlot.getDate().atTime(timeSlot.getStartTime());
            emailService.sendAppointmentRequestedEmail(
                    user.getEmail(),
                    admin.getEmail(),
                    appointmentTime
            );

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
            throw new UnauthorizedException("You can only view your own appointments.");
        }

        List<Appointment> appointments = appointmentRepository.findByUser_UserId(isAdmin ? userId : currentUserId);
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
        LocalDateTime appointmentTime = appointment.getTimeSlot().getDate()
                .atTime(appointment.getTimeSlot().getStartTime());
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
            User userAdmin = appointment.getAdmin().getUser();
            userMetricsService.setLastAppointmentDate(userAdmin, appointment.getTimeSlot().getDate().atTime(appointment.getTimeSlot().getStartTime()));
            userMetricsService.setLastAppointmentDate(appointment.getUser(), appointment.getTimeSlot().getDate().atTime(appointment.getTimeSlot().getStartTime()));
            userMetricsService.updateAppointmentCount(appointment.getUser(),1);
            userMetricsService.updateAppointmentCount(userAdmin,1);
            emailService.sendAppointmentConfirmedEmail(
                    appointment.getUser().getEmail(),
                    appointmentTime
            );
        } else if (newStatus == AppointmentStatus.CANCELLED) {
            timeSlot.setIsAvailable(true);
            timeSlotRepository.save(timeSlot);
            if(appointment.getStatus() == AppointmentStatus.CONFIRMED){
                User userAdmin = appointment.getAdmin().getUser();
                userMetricsService.updateAppointmentCount(userAdmin,-1);
                userMetricsService.updateAppointmentCount(appointment.getUser(),-1);
            }
            appointment.setStatus(AppointmentStatus.CANCELLED);
            emailService.sendAppointmentCancelledEmail(
                    appointment.getUser().getEmail(),
                    appointmentTime,
                    cancellationReason
            );
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
    @Transactional(readOnly = true)
    public Page<AppointmentSummaryResponseDTO> getAppointmentsByDateRange(LocalDate startDate, LocalDate endDate, Pageable pageable) {
        logger.info("Fetching appointments between dates: {} and {}", startDate, endDate);
        Integer userId = jwtUtils.getUserIdFromContext();
        Admin admin = adminRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new AdminNotFoundException("Admin not found"));
        Page<Appointment> appointments = appointmentRepository.findByTimeSlot_DateBetween(admin,startDate, endDate, pageable);
        return appointments.map(AppointmentMapper::toSummaryDTO);
    }

    @Override
    @Transactional(readOnly = true)
    public Page<AppointmentSummaryResponseDTO> getAppointmentsForAdmin(
            AppointmentTimeFilter timeFilter,
            AppointmentStatus status,
            Pageable pageable,
            Integer userId,
            Integer adminId) {
        if(userId == null && adminId == null){
            userId = jwtUtils.getUserIdFromContext();
        }
        Admin admin;
        if(adminId == null){
            admin = adminRepository.findByUser_UserId(userId)
                    .orElseThrow(() -> new AdminNotFoundException("Admin not found"));
        }else{
            admin = adminRepository.findById(adminId)
                    .orElseThrow(() -> new AdminNotFoundException("Admin not found"));
        }
        LocalDate today = LocalDate.now();
        LocalTime now = LocalTime.now();

        Page<Appointment> appointments;
        if (timeFilter == AppointmentTimeFilter.UPCOMING) {
            logger.info("Fetching upcoming appointments for admin ID: {} with status: {}",
                    admin.getAdminId(), status);
            appointments = appointmentRepository.findUpcomingAppointments(
                    admin, today, now, status, pageable);
        } else {
            logger.info("Fetching past appointments for admin ID: {} with status: {}",
                    admin.getAdminId(), status);
            appointments = appointmentRepository.findPastAppointments(
                    admin, today, now, status, pageable);
        }

        return appointments.map(AppointmentMapper::toSummaryDTO);
    }

}