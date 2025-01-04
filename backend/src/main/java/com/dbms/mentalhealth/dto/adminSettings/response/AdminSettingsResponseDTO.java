package com.dbms.mentalhealth.dto.adminSettings.response;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class AdminSettingsResponseDTO {
    private Integer settingId;
    private Integer adminId;
    private Boolean isCounsellor;
    private Integer maxAppointmentsPerDay;
    private Integer defaultTimeSlotDuration;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}