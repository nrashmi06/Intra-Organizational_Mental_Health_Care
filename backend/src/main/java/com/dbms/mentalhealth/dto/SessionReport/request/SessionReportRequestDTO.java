package com.dbms.mentalhealth.dto.SessionReport.request;

import lombok.Data;

@Data
public class SessionReportRequestDTO {
    private Integer sessionId;
    private String reportContent;
    private Integer severityLevel;
}