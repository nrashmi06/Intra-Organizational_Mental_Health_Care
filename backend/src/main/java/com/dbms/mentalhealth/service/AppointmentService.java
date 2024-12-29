package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.dto.Appointment.request.AppointmentRequestDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentResponseDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentSummaryResponseDTO;
import com.dbms.mentalhealth.enums.AppointmentStatus;
import com.dbms.mentalhealth.enums.AppointmentTimeFilter;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentService {
    AppointmentResponseDTO createAppointment(AppointmentRequestDTO appointmentRequestDTO);
    List<AppointmentSummaryResponseDTO> getAppointmentsByUser(Integer userId);
    AppointmentResponseDTO getAppointmentById(Integer appointmentId);
    void cancelAppointment(Integer appointmentId, String cancellationReason);
    Page<AppointmentSummaryResponseDTO> getAppointmentsByDateRange(LocalDate startDate, LocalDate endDate, Pageable pageable);
    void updateAppointmentStatus(Integer appointmentId, String status, String cancellationReason);
    Page<AppointmentSummaryResponseDTO> getAppointmentsForAdmin(AppointmentTimeFilter timeFilter, AppointmentStatus status, Pageable pageable,Integer userId,Integer adminId);
}