package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.dto.Appointment.request.AppointmentRequestDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentResponseDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentSummaryResponseDTO;

import java.time.LocalDate;
import java.util.List;

public interface AppointmentService {
    AppointmentResponseDTO createAppointment(AppointmentRequestDTO appointmentRequestDTO);
    List<AppointmentSummaryResponseDTO> getAppointmentsByUser(Integer userId);
    List<AppointmentSummaryResponseDTO> getAppointmentsByAdmin(Integer adminId);
    AppointmentResponseDTO getAppointmentById(Integer appointmentId);
    void cancelAppointment(Integer appointmentId, String cancellationReason);
    List<AppointmentSummaryResponseDTO> getAppointmentsByDateRange(LocalDate startDate, LocalDate endDate);
    void updateAppointmentStatus(Integer appointmentId, String status, String cancellationReason);
    List<AppointmentSummaryResponseDTO> getUpcomingAppointmentsForAdmin();

}