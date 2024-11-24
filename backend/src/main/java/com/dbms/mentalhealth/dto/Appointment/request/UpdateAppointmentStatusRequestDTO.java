package com.dbms.mentalhealth.dto.Appointment.request;

import lombok.Data;

@Data
public class UpdateAppointmentStatusRequestDTO {
    private String status;
    private String cancellationReason;
}