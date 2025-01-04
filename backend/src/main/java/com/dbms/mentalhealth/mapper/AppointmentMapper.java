package com.dbms.mentalhealth.mapper;

import com.dbms.mentalhealth.dto.Appointment.request.AppointmentRequestDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentResponseDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentSummaryResponseDTO;
import com.dbms.mentalhealth.enums.AppointmentStatus;
import com.dbms.mentalhealth.model.Appointment;

public class AppointmentMapper {

    public static Appointment toEntity(AppointmentRequestDTO dto) {
        Appointment appointment = new Appointment();
        appointment.setAppointmentReason(dto.getAppointmentReason());
        appointment.setStatus(AppointmentStatus.REQUESTED);
        appointment.setPhoneNumber(dto.getPhoneNumber());
        appointment.setFullName(dto.getFullName());
        appointment.setSeverityLevel(dto.getSeverityLevel());
        return appointment;
    }

    public static AppointmentResponseDTO toDTO(Appointment appointment) {
        return new AppointmentResponseDTO(
                appointment.getAppointmentId(),
                appointment.getUser().getUserId(), // Map userId
                appointment.getUser().getAnonymousName(),
                appointment.getAdmin().getFullName(),
                appointment.getAdmin().getAdminId(),
                appointment.getTimeSlot().getDate().toString(),
                appointment.getTimeSlot().getStartTime().toString(),
                appointment.getTimeSlot().getEndTime().toString(),
                appointment.getAppointmentReason(),
                appointment.getStatus().name(),
                appointment.getPhoneNumber(),
                appointment.getFullName(),
                appointment.getSeverityLevel()
        );
    }

    public static AppointmentSummaryResponseDTO toSummaryDTO(Appointment appointment) {
        return new AppointmentSummaryResponseDTO(
                appointment.getAppointmentId(),
                appointment.getAppointmentReason(),
                appointment.getUser().getAnonymousName(),
                appointment.getAdmin().getFullName(),
                appointment.getStatus().name(),
                appointment.getTimeSlot().getDate(),
                appointment.getTimeSlot().getStartTime(),
                appointment.getTimeSlot().getEndTime()
        );
    }
}