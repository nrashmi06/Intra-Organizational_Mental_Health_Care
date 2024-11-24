package com.dbms.mentalhealth.dto.TimeSlot.response;

import lombok.Data;
import java.time.LocalDate;
import java.time.LocalTime;

@Data
public class TimeSlotResponseDTO {
    private Integer timeSlotId;
    private LocalDate date;
    private LocalTime startTime;
    private LocalTime endTime;
    private Boolean isAvailable;
}