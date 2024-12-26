package com.dbms.mentalhealth.dto.Appointment.response;

import com.dbms.mentalhealth.enums.SeverityLevel;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AppointmentResponseDTO {
    private Integer appointmentId;
    private Integer userId; // Add this field
    private String userName;
    private String adminName;
    private Integer adminId;
    private String timeSlotDate;
    private String timeSlotStartTime;
    private String timeSlotEndTime;
    private String appointmentReason;
    private String status;
    private String phoneNumber;
    private String fullName;
    private SeverityLevel severityLevel;
}