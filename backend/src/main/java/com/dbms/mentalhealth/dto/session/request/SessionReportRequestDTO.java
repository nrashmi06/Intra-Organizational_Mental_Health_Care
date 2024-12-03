package com.dbms.mentalhealth.dto.session.request;

import lombok.Data;

@Data
public class SessionReportRequestDTO {
    private Integer sessionId;
    private String reportContent;
    private Integer severityLevel;
}