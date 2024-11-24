package com.dbms.mentalhealth.dto.Appointment.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AppointmentSummaryResponseDTO {
    private Integer appointmentId;
    private String title;
    private String userName;
    private String adminName;
    private String status;
}