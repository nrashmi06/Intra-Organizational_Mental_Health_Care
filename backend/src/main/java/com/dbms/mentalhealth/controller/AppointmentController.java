package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.Appointment.request.AppointmentRequestDTO;
import com.dbms.mentalhealth.dto.Appointment.request.UpdateAppointmentStatusRequestDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentResponseDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentSummaryResponseDTO;
import com.dbms.mentalhealth.exception.appointment.AppointmentNotFoundException;
import com.dbms.mentalhealth.service.AppointmentService;
import com.dbms.mentalhealth.urlMapper.AppointmentUrlMapping;
import com.dbms.mentalhealth.util.AppointmentETagGenerator;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;
import java.util.Objects;

@RestController
public class AppointmentController {

    private final AppointmentService appointmentService;
    private final AppointmentETagGenerator eTagGenerator;

    public AppointmentController(AppointmentService appointmentService, AppointmentETagGenerator eTagGenerator) {
        this.appointmentService = Objects.requireNonNull(appointmentService, "appointmentService cannot be null");
        this.eTagGenerator = Objects.requireNonNull(eTagGenerator, "eTagGenerator cannot be null");
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping(AppointmentUrlMapping.BOOK_APPOINTMENT)
    public ResponseEntity<AppointmentResponseDTO> createAppointment(@RequestBody AppointmentRequestDTO appointmentRequestDTO) {
        if (appointmentRequestDTO == null ||
                appointmentRequestDTO.getFullName() == null || appointmentRequestDTO.getFullName().trim().isEmpty() ||
                appointmentRequestDTO.getPhoneNumber() == null || appointmentRequestDTO.getPhoneNumber().trim().isEmpty() ||
                appointmentRequestDTO.getSeverityLevel() == null) {
            return ResponseEntity.badRequest().build();
        }

        AppointmentResponseDTO appointment = appointmentService.createAppointment(appointmentRequestDTO);
        String eTag = eTagGenerator.generateAppointmentETag(appointment);
        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(appointment);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping(AppointmentUrlMapping.GET_APPOINTMENTS_BY_USER)
    public ResponseEntity<List<AppointmentSummaryResponseDTO>> getAppointmentsByUser(
            @RequestParam(value = "userId", required = false) Integer userId,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch) {

        List<AppointmentSummaryResponseDTO> appointments = appointmentService.getAppointmentsByUser(userId);
        if (appointments == null || appointments.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        String eTag = eTagGenerator.generateListETag(appointments);
        if (ifNoneMatch != null && !ifNoneMatch.trim().isEmpty() && eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .header(HttpHeaders.ETAG, eTag)
                    .build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(appointments);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(AppointmentUrlMapping.GET_APPOINTMENTS_BY_ADMIN)
    public ResponseEntity<List<AppointmentSummaryResponseDTO>> getAppointmentsByAdmin(
            @RequestParam(value = "userId", required = false) Integer userId,
            @RequestParam(value = "adminId", required = false) Integer adminId,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch) {

        List<AppointmentSummaryResponseDTO> appointments = appointmentService.getAppointmentsByAdmin(userId, adminId);
        if (appointments == null || appointments.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        String eTag = eTagGenerator.generateListETag(appointments);
        if (ifNoneMatch != null && !ifNoneMatch.trim().isEmpty() && eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .header(HttpHeaders.ETAG, eTag)
                    .build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(appointments);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping(AppointmentUrlMapping.GET_APPOINTMENT_BY_ID)
    public ResponseEntity<AppointmentResponseDTO> getAppointmentById(
            @PathVariable Integer appointmentId,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch) {
        if (appointmentId == null) {
            return ResponseEntity.badRequest().build();
        }

        AppointmentResponseDTO appointment = appointmentService.getAppointmentById(appointmentId);
        String eTag = eTagGenerator.generateAppointmentETag(appointment);
        if (ifNoneMatch != null && !ifNoneMatch.trim().isEmpty() && eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .header(HttpHeaders.ETAG, eTag)
                    .build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(appointment);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(AppointmentUrlMapping.UPDATE_APPOINTMENT_STATUS)
    public ResponseEntity<Void> updateAppointmentStatus(
            @PathVariable Integer appointmentId,
            @RequestBody UpdateAppointmentStatusRequestDTO request) {
        if (appointmentId == null || request == null ||
                request.getStatus() == null || request.getStatus().trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        appointmentService.updateAppointmentStatus(appointmentId, request.getStatus(), request.getCancellationReason());
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping(AppointmentUrlMapping.CANCEL_APPOINTMENT)
    public ResponseEntity<Void> cancelAppointment(
            @PathVariable Integer appointmentId,
            @RequestBody String cancellationReason) {
        if (appointmentId == null) {
            return ResponseEntity.badRequest().build();
        }

        appointmentService.cancelAppointment(appointmentId, cancellationReason);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(AppointmentUrlMapping.GET_APPOINTMENTS_BY_DATE_RANGE)
    public ResponseEntity<List<AppointmentSummaryResponseDTO>> getAppointmentsByDateRange(
            @RequestParam("startDate") LocalDate startDate,
            @RequestParam("endDate") LocalDate endDate,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch) {
        if (startDate == null || endDate == null || startDate.isAfter(endDate)) {
            return ResponseEntity.badRequest().build();
        }

        List<AppointmentSummaryResponseDTO> appointments = appointmentService.getAppointmentsByDateRange(startDate, endDate);
        if (appointments == null || appointments.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        String eTag = eTagGenerator.generateListETag(appointments);
        if (ifNoneMatch != null && !ifNoneMatch.trim().isEmpty() && eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .header(HttpHeaders.ETAG, eTag)
                    .build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(appointments);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(AppointmentUrlMapping.GET_CURRENT_ADMIN_UPCOMING_APPOINTMENTS)
    public ResponseEntity<List<AppointmentSummaryResponseDTO>> getCurrentAdminUpcomingAppointments(
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch) {

        List<AppointmentSummaryResponseDTO> appointments = appointmentService.getUpcomingAppointmentsForAdmin();
        if (appointments == null || appointments.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        String eTag = eTagGenerator.generateListETag(appointments);
        if (ifNoneMatch != null && !ifNoneMatch.trim().isEmpty() && eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .header(HttpHeaders.ETAG, eTag)
                    .build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(appointments);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(AppointmentUrlMapping.GET_APPOINTMENTS_BY_ADMIN_STATUS)
    public ResponseEntity<List<AppointmentSummaryResponseDTO>> getAppointmentsByAdminStatus(
            @RequestParam("status") String status,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch) {
        if (status == null || status.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        List<AppointmentSummaryResponseDTO> appointments = appointmentService.getAppointmentsByAdminStatus(status);
        if (appointments == null || appointments.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        String eTag = eTagGenerator.generateListETag(appointments);
        if (ifNoneMatch != null && !ifNoneMatch.trim().isEmpty() && eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .header(HttpHeaders.ETAG, eTag)
                    .build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(appointments);
    }
}