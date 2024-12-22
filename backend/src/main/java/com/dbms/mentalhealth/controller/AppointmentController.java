package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.Appointment.request.AppointmentRequestDTO;
import com.dbms.mentalhealth.dto.Appointment.request.UpdateAppointmentStatusRequestDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentResponseDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentSummaryResponseDTO;
import com.dbms.mentalhealth.exception.appointment.AppointmentNotFoundException;
import com.dbms.mentalhealth.exception.user.UserNotFoundException;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.AppointmentService;
import com.dbms.mentalhealth.urlMapper.AppointmentUrlMapping;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final JwtUtils jwtUtils;

    public AppointmentController(AppointmentService appointmentService, JwtUtils jwtUtils) {
        this.appointmentService = appointmentService;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping(AppointmentUrlMapping.BOOK_APPOINTMENT)
    public ResponseEntity<?> createAppointment(@RequestBody AppointmentRequestDTO appointmentRequestDTO) {
        if (appointmentRequestDTO.getFullName() == null || appointmentRequestDTO.getFullName().isEmpty() || appointmentRequestDTO.getPhoneNumber() == null || appointmentRequestDTO.getPhoneNumber().isEmpty() || appointmentRequestDTO.getSeverityLevel() == null) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Some fields are missing");
        }
        try {
            AppointmentResponseDTO appointmentResponseDTO = appointmentService.createAppointment(appointmentRequestDTO);
            return ResponseEntity.ok(appointmentResponseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }

    @GetMapping(AppointmentUrlMapping.GET_APPOINTMENTS_BY_USER)
    public ResponseEntity<?> getAppointmentsByUser(@RequestParam(value = "userId", required = false) Integer userId) {
        try {
            List<AppointmentSummaryResponseDTO> appointments = appointmentService.getAppointmentsByUser(userId);
            return ResponseEntity.ok(appointments);
        } catch (AppointmentNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @GetMapping(AppointmentUrlMapping.GET_APPOINTMENTS_BY_ADMIN)
    public ResponseEntity<List<AppointmentSummaryResponseDTO>> getAppointmentsByAdmin(
            @RequestParam(value = "userId", required = false) Integer userId,
            @RequestParam(value = "adminId", required = false) Integer adminId) {
        try {
            List<AppointmentSummaryResponseDTO> appointments = appointmentService.getAppointmentsByAdmin(userId, adminId);
            return ResponseEntity.ok(appointments);
        } catch (AppointmentNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }


    @GetMapping(AppointmentUrlMapping.GET_APPOINTMENT_BY_ID)
    public ResponseEntity<?> getAppointmentById(@PathVariable Integer appointmentId) {
        try {
            AppointmentResponseDTO appointment = appointmentService.getAppointmentById(appointmentId);
            return ResponseEntity.ok(appointment);
        } catch (AppointmentNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(AppointmentUrlMapping.UPDATE_APPOINTMENT_STATUS)
    public ResponseEntity<?> updateAppointmentStatus(@PathVariable Integer appointmentId, @RequestBody UpdateAppointmentStatusRequestDTO request) {
        try {
            appointmentService.updateAppointmentStatus(appointmentId, request.getStatus(), request.getCancellationReason());
            return ResponseEntity.noContent().build();
        } catch (AppointmentNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping(AppointmentUrlMapping.CANCEL_APPOINTMENT)
    public ResponseEntity<?> cancelAppointment(@PathVariable Integer appointmentId, @RequestBody String cancellationReason) {
        try {
            appointmentService.cancelAppointment(appointmentId, cancellationReason);
            return ResponseEntity.noContent().build();
        } catch (AppointmentNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping(AppointmentUrlMapping.GET_APPOINTMENTS_BY_DATE_RANGE)
    public ResponseEntity<?> getAppointmentsByDateRange(
            @RequestParam("startDate") LocalDate startDate,
            @RequestParam("endDate") LocalDate endDate) {
        try {
            List<AppointmentSummaryResponseDTO> appointments = appointmentService.getAppointmentsByDateRange(startDate, endDate);
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping(AppointmentUrlMapping.GET_CURRENT_ADMIN_UPCOMING_APPOINTMENTS)
    public ResponseEntity<?> getCurrentAdminUpcomingAppointments() {
        try {
            List<AppointmentSummaryResponseDTO> appointments = appointmentService.getUpcomingAppointmentsForAdmin();
            return ResponseEntity.ok(appointments);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(e.getMessage());
        }
    }
}