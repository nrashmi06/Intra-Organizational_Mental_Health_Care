package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.Appointment.request.AppointmentRequestDTO;
import com.dbms.mentalhealth.dto.Appointment.request.UpdateAppointmentStatusRequestDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentResponseDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentSummaryResponseDTO;
import com.dbms.mentalhealth.enums.AppointmentStatus;
import com.dbms.mentalhealth.enums.AppointmentTimeFilter;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.AppointmentService;
import com.dbms.mentalhealth.urlMapper.AppointmentUrlMapping;
import com.dbms.mentalhealth.util.Etags.AppointmentETagGenerator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
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
    private final JwtUtils jwtUtils;

    public AppointmentController(AppointmentService appointmentService, AppointmentETagGenerator eTagGenerator, JwtUtils jwtUtils) {
        this.appointmentService = Objects.requireNonNull(appointmentService, "appointmentService cannot be null");
        this.eTagGenerator = Objects.requireNonNull(eTagGenerator, "eTagGenerator cannot be null");
        this.jwtUtils = Objects.requireNonNull(jwtUtils, "jwtUtils cannot be null");
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
            @PathVariable(name="userId",required = false) Integer userId,
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


    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(AppointmentUrlMapping.GET_APPOINTMENTS_BY_DATE_RANGE)
    public ResponseEntity<Page<AppointmentSummaryResponseDTO>> getAppointmentsByDateRange(
            @RequestParam("startDate") LocalDate startDate,
            @RequestParam("endDate") LocalDate endDate,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch,
            @PageableDefault(size = 10) Pageable pageable) {
        if (startDate == null || endDate == null || startDate.isAfter(endDate)) {
            return ResponseEntity.badRequest().build();
        }

        Page<AppointmentSummaryResponseDTO> appointments = appointmentService.getAppointmentsByDateRange(startDate, endDate, pageable);

        String eTag = eTagGenerator.generatePageETag(appointments);
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
    @GetMapping(AppointmentUrlMapping.GET_ADMIN_APPOINTMENTS)
    public ResponseEntity<Page<AppointmentSummaryResponseDTO>> getAdminAppointments(
            @RequestParam(value = "userId", required = false) Integer userId,
            @RequestParam(value = "adminId", required = false) Integer adminId,
            @RequestParam(required = false, defaultValue = "PAST") AppointmentTimeFilter timeFilter,
            @RequestParam(required = false) AppointmentStatus status,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch,
            @PageableDefault(size = 10) Pageable pageable) {

        Pageable sortedPageable = PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize()
        );

        Page<AppointmentSummaryResponseDTO> appointments =
                appointmentService.getAppointmentsForAdmin(timeFilter, status, sortedPageable, userId, adminId);

        String eTag = eTagGenerator.generatePageETag(appointments);
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