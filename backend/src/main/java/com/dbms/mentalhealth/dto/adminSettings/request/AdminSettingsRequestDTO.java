package com.dbms.mentalhealth.dto.adminSettings.request;

import lombok.Data;

@Data
public class AdminSettingsRequestDTO {
    private Boolean isCounsellor;
    private Integer maxAppointmentsPerDay;
    private Integer defaultTimeSlotDuration;
}