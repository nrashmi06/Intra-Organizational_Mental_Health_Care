package com.dbms.mentalhealth.dto.SessionReport.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SessionReportResponseDTO {
    private Integer reportId;
    private Integer sessionId;
    private Integer userId;
    private Integer listenerId;
    private String reportContent;
    private Integer severityLevel;
    private LocalDateTime createdAt;
}