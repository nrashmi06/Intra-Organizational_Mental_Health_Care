package com.dbms.mentalhealth.mapper;

import com.dbms.mentalhealth.dto.Appointment.request.AppointmentRequestDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentResponseDTO;
import com.dbms.mentalhealth.dto.Appointment.response.AppointmentSummaryResponseDTO;
import com.dbms.mentalhealth.dto.TimeSlot.request.TimeSlotCreateRequestDTO.TimeSlotDTO;
import com.dbms.mentalhealth.enums.AppointmentStatus;
import com.dbms.mentalhealth.model.Appointment;

public class AppointmentMapper {

    public static Appointment toEntity(AppointmentRequestDTO dto) {
        Appointment appointment = new Appointment();
        appointment.setAppointmentReason(dto.getAppointmentReason());
        appointment.setStatus(AppointmentStatus.REQUESTED);
        return appointment;
    }

    public static AppointmentResponseDTO toDTO(Appointment appointment) {
        TimeSlotDTO timeSlotDTO = new TimeSlotDTO(
                appointment.getTimeSlot().getStartTime(),
                appointment.getTimeSlot().getEndTime()
        );
        return new AppointmentResponseDTO(
                appointment.getAppointmentId(),
                appointment.getUser().getAnonymousName(),  // Assuming User has a getName() method
                appointment.getAdmin().getFullName(),  // Assuming Admin has a getName() method
                timeSlotDTO,
                appointment.getAppointmentReason(),
                appointment.getStatus().name()
        );
    }
    public static AppointmentSummaryResponseDTO toSummaryDTO(Appointment appointment) {
        return new AppointmentSummaryResponseDTO(
                appointment.getAppointmentId(),
                appointment.getAppointmentReason(),
                appointment.getUser().getAnonymousName(),
                appointment.getAdmin().getFullName(),
                appointment.getStatus().name()
        );
    }
}