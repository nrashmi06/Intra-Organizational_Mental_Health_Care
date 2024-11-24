package com.dbms.mentalhealth.dto.Appointment.response;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalTime;

@Data
@AllArgsConstructor
public class AppointmentSummaryResponseDTO {
    private Integer appointmentId;
    private String title;
    private String userName;
    private String adminName;
    private String status;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
}