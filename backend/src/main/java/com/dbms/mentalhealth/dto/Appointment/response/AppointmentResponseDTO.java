package com.dbms.mentalhealth.dto.Appointment.response;

import com.dbms.mentalhealth.dto.TimeSlot.request.TimeSlotCreateRequestDTO.TimeSlotDTO;
import com.dbms.mentalhealth.enums.SeverityLevel;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AppointmentResponseDTO {
    private Integer appointmentId;
    private String userName;
    private String adminName;
    private String timeSlotDate;
    private String timeSlotStartTime;
    private String timeSlotEndTime;
    private String appointmentReason;
    private String status;
    private String phoneNumber;
    private String fullName;
    private SeverityLevel severityLevel;
}