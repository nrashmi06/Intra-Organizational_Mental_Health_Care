package com.dbms.mentalhealth.dto.Appointment.request;
import com.dbms.mentalhealth.enums.SeverityLevel;
import lombok.Data;

@Data
public class AppointmentRequestDTO {
    private Integer adminId;
    private Integer timeSlotId;
    private String appointmentReason;
    private String phoneNumber;
    private String fullName;
    private SeverityLevel severityLevel;
}