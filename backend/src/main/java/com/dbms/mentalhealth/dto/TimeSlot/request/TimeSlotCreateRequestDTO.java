package com.dbms.mentalhealth.dto.TimeSlot.request;

import lombok.Data;
import java.time.LocalTime;
import java.util.List;

@Data
public class TimeSlotCreateRequestDTO {
    private List<TimeSlotDTO> timeSlots;

    @Data
    public static class TimeSlotDTO {
        private LocalTime startTime;
        private LocalTime endTime;
    }
}