package com.dbms.mentalhealth.dto.Appointment.response;

import com.dbms.mentalhealth.dto.TimeSlot.request.TimeSlotCreateRequestDTO.TimeSlotDTO;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AppointmentResponseDTO {
    private Integer appointmentId;
    private String userName;
    private String adminName;
    private TimeSlotDTO timeSlot;  // Use the existing TimeSlotDTO
    private String appointmentReason;
    private String status;
}