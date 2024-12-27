package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.session.request.SessionReportRequestDTO;
import com.dbms.mentalhealth.dto.session.response.SessionReportResponseDTO;
import com.dbms.mentalhealth.dto.session.response.SessionReportSummaryResponseDTO;
import com.dbms.mentalhealth.service.SessionReportService;
import com.dbms.mentalhealth.urlMapper.SessionReportUrlMapping;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class SessionReportController {

    private final SessionReportService sessionReportService;

    public SessionReportController(SessionReportService sessionReportService) {
        this.sessionReportService = sessionReportService;
    }

    @PreAuthorize("hasRole('ROLE_LISTENER')")
    @PostMapping(SessionReportUrlMapping.CREATE_REPORT)
    public ResponseEntity<SessionReportResponseDTO> createReport(@RequestBody SessionReportRequestDTO requestDTO) {
        SessionReportResponseDTO responseDTO = sessionReportService.createReport(requestDTO);
        return ResponseEntity.ok(responseDTO);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(SessionReportUrlMapping.GET_REPORT_BY_SESSION_ID)
    public ResponseEntity<List<SessionReportResponseDTO>> getReportBySessionId(@PathVariable Integer sessionId) {
        List<SessionReportResponseDTO> reportList = sessionReportService.getReportBySessionId(sessionId);
        return ResponseEntity.ok(reportList);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(SessionReportUrlMapping.GET_REPORT_BY_ID)
    public ResponseEntity<SessionReportResponseDTO> getReportById(@PathVariable Integer reportId) {
        SessionReportResponseDTO responseDTO = sessionReportService.getReportById(reportId);
        return ResponseEntity.ok(responseDTO);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(SessionReportUrlMapping.GET_ALL_USER_REPORTS)
    public ResponseEntity<List<SessionReportResponseDTO>> getAllUserReports(@PathVariable Integer userId) {
        List<SessionReportResponseDTO> reportList = sessionReportService.getAllUserReports(userId);
        return ResponseEntity.ok(reportList);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(SessionReportUrlMapping.GET_ALL_REPORT_SUMMARY)
    public ResponseEntity<SessionReportSummaryResponseDTO> getReportSummary() {
        SessionReportSummaryResponseDTO summaryDTO = sessionReportService.getReportSummary();
        return ResponseEntity.ok(summaryDTO);
    }
}