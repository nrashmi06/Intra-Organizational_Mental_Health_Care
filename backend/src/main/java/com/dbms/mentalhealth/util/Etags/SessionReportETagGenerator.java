package com.dbms.mentalhealth.util.Etags;

import com.dbms.mentalhealth.dto.SessionReport.SessionReportResponseDTO;
import com.dbms.mentalhealth.dto.SessionReport.SessionReportSummaryResponseDTO;
import org.springframework.stereotype.Component;
import java.util.List;
import java.util.Objects;
import java.util.stream.Collectors;

@Component
public class SessionReportETagGenerator {
    private static final String REPORT_TAG_FORMAT = "report-%d-%d-%d-%d-%s"; // reportId-sessionId-userId-severity-timestamp
    private static final String LIST_TAG_FORMAT = "report-list-%d-%d"; // size-hash
    private static final String SUMMARY_TAG_FORMAT = "report-summary-%.2f-%d-%d-%d-%d-%d"; // avgSeverity and counts

    /**
     * Generates an ETag for a single session report.
     */
    public String generateReportETag(SessionReportResponseDTO report) {
        validateReport(report);

        return String.format(REPORT_TAG_FORMAT,
                report.getReportId(),
                report.getSessionId(),
                report.getUserId(),
                report.getSeverityLevel(),
                report.getCreatedAt().toString()
        );
    }

    /**
     * Generates an ETag for a list of session reports.
     */
    public String generateListETag(List<SessionReportResponseDTO> reportList) {
        if (reportList == null) {
            throw new IllegalArgumentException("Report list cannot be null");
        }

        String contentFingerprint = reportList.stream()
                .filter(Objects::nonNull)
                .map(this::generateReportFingerprint)
                .sorted()
                .collect(Collectors.joining());

        int contentHash = Objects.hash(contentFingerprint);

        return String.format(LIST_TAG_FORMAT,
                reportList.size(),
                contentHash
        );
    }

    /**
     * Generates an ETag for report summary.
     */
    public String generateSummaryETag(SessionReportSummaryResponseDTO summary) {
        if (summary == null) {
            throw new IllegalArgumentException("Report summary cannot be null");
        }

        return String.format(SUMMARY_TAG_FORMAT,
                summary.getAverageSeverity().doubleValue(),
                summary.getSeverityLevel5Count(),
                summary.getSeverityLevel4Count(),
                summary.getSeverityLevel3Count(),
                summary.getSeverityLevel2Count(),
                summary.getSeverityLevel1Count()
        );
    }

    /**
     * Generates a fingerprint string for a single report.
     */
    private String generateReportFingerprint(SessionReportResponseDTO report) {
        return String.format("%d-%d-%d-%d-%d-%s-%s",
                report.getReportId(),
                report.getSessionId(),
                report.getUserId(),
                report.getListenerId(),
                report.getSeverityLevel(),
                report.getReportContent(),
                report.getCreatedAt().toString()
        );
    }

    /**
     * Validates that a report and its required fields are not null.
     */
    private void validateReport(SessionReportResponseDTO report) {
        if (report == null) {
            throw new IllegalArgumentException("Report cannot be null");
        }
        if (report.getReportId() == null) {
            throw new IllegalArgumentException("Report ID cannot be null");
        }
        if (report.getSessionId() == null) {
            throw new IllegalArgumentException("Session ID cannot be null");
        }
        if (report.getUserId() == null) {
            throw new IllegalArgumentException("User ID cannot be null");
        }
        if (report.getListenerId() == null) {
            throw new IllegalArgumentException("Listener ID cannot be null");
        }
        if (report.getSeverityLevel() == null) {
            throw new IllegalArgumentException("Severity level cannot be null");
        }
        if (report.getCreatedAt() == null) {
            throw new IllegalArgumentException("Created timestamp cannot be null");
        }
    }
}