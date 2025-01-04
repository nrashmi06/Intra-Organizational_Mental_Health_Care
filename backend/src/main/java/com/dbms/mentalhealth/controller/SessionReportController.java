package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.SessionReport.request.SessionReportRequestDTO;
import com.dbms.mentalhealth.dto.SessionReport.response.SessionReportResponseDTO;
import com.dbms.mentalhealth.dto.SessionReport.response.SessionReportSummaryResponseDTO;
import com.dbms.mentalhealth.service.SessionReportService;
import com.dbms.mentalhealth.urlMapper.SessionReportUrlMapping;
import com.dbms.mentalhealth.util.Etags.SessionReportETagGenerator;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
public class SessionReportController {

    private final SessionReportService sessionReportService;
    private final SessionReportETagGenerator eTagGenerator;

    public SessionReportController(SessionReportService sessionReportService,
                                   SessionReportETagGenerator eTagGenerator) {
        this.sessionReportService = Objects.requireNonNull(sessionReportService,
                "sessionReportService cannot be null");
        this.eTagGenerator = Objects.requireNonNull(eTagGenerator,
                "eTagGenerator cannot be null");
    }

    @PreAuthorize("hasRole('ROLE_LISTENER')")
    @PostMapping(SessionReportUrlMapping.CREATE_REPORT)
    public ResponseEntity<SessionReportResponseDTO> createReport(
            @RequestBody SessionReportRequestDTO requestDTO) {
        if (requestDTO == null) {
            return ResponseEntity.badRequest().build();
        }

        SessionReportResponseDTO responseDTO = sessionReportService.createReport(requestDTO);
        String eTag = eTagGenerator.generateReportETag(responseDTO);

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(responseDTO);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(SessionReportUrlMapping.GET_REPORT_BY_SESSION_ID)
    public ResponseEntity<List<SessionReportResponseDTO>> getReportBySessionId(
            @PathVariable Integer sessionId,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch) {
        if (sessionId == null) {
            return ResponseEntity.badRequest().build();
        }

        List<SessionReportResponseDTO> reportList = sessionReportService.getReportBySessionId(sessionId);
        if (reportList == null || reportList.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        String eTag = eTagGenerator.generateListETag(reportList);
        if (ifNoneMatch != null && !ifNoneMatch.trim().isEmpty() && eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .header(HttpHeaders.ETAG, eTag)
                    .build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(reportList);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(SessionReportUrlMapping.GET_REPORT_BY_ID)
    public ResponseEntity<SessionReportResponseDTO> getReportById(
            @PathVariable Integer reportId,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch) {
        if (reportId == null) {
            return ResponseEntity.badRequest().build();
        }

        SessionReportResponseDTO responseDTO = sessionReportService.getReportById(reportId);
        String eTag = eTagGenerator.generateReportETag(responseDTO);
        if (ifNoneMatch != null && !ifNoneMatch.trim().isEmpty() && eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .header(HttpHeaders.ETAG, eTag)
                    .build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(responseDTO);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(SessionReportUrlMapping.GET_ALL_USER_REPORTS)
    public ResponseEntity<List<SessionReportResponseDTO>> getAllUserReports(
            @PathVariable Integer userId,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch) {
        if (userId == null) {
            return ResponseEntity.badRequest().build();
        }

        List<SessionReportResponseDTO> reportList = sessionReportService.getAllUserReports(userId);
        if (reportList == null || reportList.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        String eTag = eTagGenerator.generateListETag(reportList);
        if (ifNoneMatch != null && !ifNoneMatch.trim().isEmpty() && eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .header(HttpHeaders.ETAG, eTag)
                    .build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(reportList);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(SessionReportUrlMapping.GET_ALL_REPORT_SUMMARY)
    public ResponseEntity<SessionReportSummaryResponseDTO> getReportSummary(
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch) {

        SessionReportSummaryResponseDTO summaryDTO = sessionReportService.getReportSummary();
        if (summaryDTO == null) {
            return ResponseEntity.noContent().build();
        }

        String eTag = eTagGenerator.generateSummaryETag(summaryDTO);
        if (ifNoneMatch != null && !ifNoneMatch.trim().isEmpty() && eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .header(HttpHeaders.ETAG, eTag)
                    .build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(summaryDTO);
    }
}