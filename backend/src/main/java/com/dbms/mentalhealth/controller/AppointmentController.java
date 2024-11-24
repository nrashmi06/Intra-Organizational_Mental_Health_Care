package com.dbms.mentalhealth.controller;
import com.dbms.mentalhealth.dto.Appointment.request.AppointmentRequestDTO;
import com.dbms.mentalhealth.dto.Appointment.request.UpdateAppointmentStatusRequestDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentResponseDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentSummaryResponseDTO;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.AppointmentService;
import com.dbms.mentalhealth.urlMapper.AppointmentUrlMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final JwtUtils jwtUtils;

    public AppointmentController(AppointmentService appointmentService, JwtUtils jwtUtils) {
        this.appointmentService = appointmentService;
        this.jwtUtils = jwtUtils;
    }

    @PreAuthorize("hasRole('USER')")
    @PostMapping(AppointmentUrlMapping.BOOK_APPOINTMENT)
    public ResponseEntity<AppointmentResponseDTO> createAppointment(@RequestBody AppointmentRequestDTO appointmentRequestDTO) {
        AppointmentResponseDTO appointmentResponseDTO = appointmentService.createAppointment(appointmentRequestDTO);
        return ResponseEntity.ok(appointmentResponseDTO);
    }
    @GetMapping(AppointmentUrlMapping.GET_APPOINTMENTS_BY_USER)
    public ResponseEntity<List<AppointmentSummaryResponseDTO>> getAppointmentsByUser(@RequestParam(value = "userId",required = false) Integer userId) {
        List<AppointmentSummaryResponseDTO> appointments = appointmentService.getAppointmentsByUser(userId);
        return ResponseEntity.ok(appointments);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping(AppointmentUrlMapping.GET_APPOINTMENTS_BY_ADMIN)
    public ResponseEntity<List<AppointmentSummaryResponseDTO>> getAppointmentsByAdmin(@RequestParam(value = "adminId", required = false) Integer adminId) {
        List<AppointmentSummaryResponseDTO> appointments = appointmentService.getAppointmentsByAdmin(adminId);
        return ResponseEntity.ok(appointments);
    }

    @GetMapping(AppointmentUrlMapping.GET_APPOINTMENT_BY_ID)
    public ResponseEntity<AppointmentResponseDTO> getAppointmentById(@PathVariable Integer appointmentId) {
        AppointmentResponseDTO appointment = appointmentService.getAppointmentById(appointmentId);
        return ResponseEntity.ok(appointment);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(AppointmentUrlMapping.UPDATE_APPOINTMENT_STATUS)
    public ResponseEntity<Void> updateAppointmentStatus(@PathVariable Integer appointmentId, @RequestBody UpdateAppointmentStatusRequestDTO request) {
        appointmentService.updateAppointmentStatus(appointmentId, request.getStatus(), request.getCancellationReason());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('USER')")
    @PutMapping(AppointmentUrlMapping.CANCEL_APPOINTMENT)
    public ResponseEntity<Void> cancelAppointment(@PathVariable Integer appointmentId, @RequestBody String cancellationReason) {
        appointmentService.cancelAppointment(appointmentId, cancellationReason);
        return ResponseEntity.noContent().build();
    }
}