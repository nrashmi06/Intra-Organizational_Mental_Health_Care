package com.dbms.mentalhealth.dto.SessionReport.response;

import lombok.Data;

import java.math.BigDecimal;

@Data
public class SessionReportSummaryResponseDTO {
    private BigDecimal averageSeverity;
    private Integer severityLevel5Count;
    private Integer severityLevel4Count;
    private Integer severityLevel3Count;
    private Integer severityLevel2Count;
    private Integer severityLevel1Count;

    public SessionReportSummaryResponseDTO(BigDecimal averageSeverity, Integer severityLevel5Count, Integer severityLevel4Count, Integer severityLevel3Count, Integer severityLevel2Count, Integer severityLevel1Count) {
        this.averageSeverity = averageSeverity;
        this.severityLevel5Count = severityLevel5Count;
        this.severityLevel4Count = severityLevel4Count;
        this.severityLevel3Count = severityLevel3Count;
        this.severityLevel2Count = severityLevel2Count;
        this.severityLevel1Count = severityLevel1Count;
    }
}