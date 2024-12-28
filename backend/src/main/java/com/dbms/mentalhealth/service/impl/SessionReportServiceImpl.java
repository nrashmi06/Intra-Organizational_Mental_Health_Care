package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.session.request.SessionReportRequestDTO;
import com.dbms.mentalhealth.dto.SessionReport.SessionReportResponseDTO;
import com.dbms.mentalhealth.dto.SessionReport.SessionReportSummaryResponseDTO;
import com.dbms.mentalhealth.exception.session.ReportNotFoundException;
import com.dbms.mentalhealth.mapper.SessionReportMapper;
import com.dbms.mentalhealth.model.SessionReport;
import com.dbms.mentalhealth.repository.SessionReportRepository;
import com.dbms.mentalhealth.service.SessionReportService;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;


import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

@Service
public class SessionReportServiceImpl implements SessionReportService {

    private final SessionReportRepository sessionReportRepository;
    private final SessionReportMapper sessionReportMapper;

    public SessionReportServiceImpl(SessionReportRepository sessionReportRepository, SessionReportMapper sessionReportMapper) {
        this.sessionReportRepository = sessionReportRepository;
        this.sessionReportMapper = sessionReportMapper;
    }

    @Override
    @Transactional
    public SessionReportResponseDTO createReport(SessionReportRequestDTO requestDTO) {
        SessionReport sessionReport = sessionReportMapper.toEntity(requestDTO);
        sessionReport = sessionReportRepository.save(sessionReport);
        return sessionReportMapper.toResponseDTO(sessionReport);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionReportResponseDTO> getReportBySessionId(Integer sessionId) {
        List<SessionReport> reportList = sessionReportRepository.findBySession_SessionId(sessionId);
        if (reportList.isEmpty()) {
            throw new ReportNotFoundException("No reports found for session with ID " + sessionId);
        }
        return reportList.stream()
                .map(sessionReportMapper::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SessionReportResponseDTO getReportById(Integer reportId) {
        SessionReport sessionReport = sessionReportRepository.findById(reportId)
                .orElseThrow(() -> new ReportNotFoundException("Report with id " + reportId + " not found"));
        return sessionReportMapper.toResponseDTO(sessionReport);
    }

    @Override
    @Transactional(readOnly = true)
    public List<SessionReportResponseDTO> getAllUserReports(Integer userId) {
        List<SessionReport> reportList = sessionReportRepository.findByUser_UserId(userId);
        if (reportList.isEmpty()) {
            throw new ReportNotFoundException("No reports found for user with ID " + userId);
        }
        return reportList.stream()
                .map(sessionReportMapper::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public SessionReportSummaryResponseDTO getReportSummary() {
        List<SessionReport> reports = sessionReportRepository.findAll();
        if (reports.isEmpty()) {
            throw new ReportNotFoundException("No reports found");
        }

        BigDecimal avgSeverity = reports.stream()
                .map(SessionReport::getSeverityLevel)
                .map(BigDecimal::valueOf)
                .reduce(BigDecimal.ZERO, BigDecimal::add)
                .divide(BigDecimal.valueOf(reports.size()), 2, BigDecimal.ROUND_HALF_UP);

        Map<Integer, Long> reportsBySeverity = reports.stream()
                .collect(Collectors.groupingBy(SessionReport::getSeverityLevel, Collectors.counting()));

        return new SessionReportSummaryResponseDTO(
                avgSeverity,
                reportsBySeverity.getOrDefault(5, 0L).intValue(),
                reportsBySeverity.getOrDefault(4, 0L).intValue(),
                reportsBySeverity.getOrDefault(3, 0L).intValue(),
                reportsBySeverity.getOrDefault(2, 0L).intValue(),
                reportsBySeverity.getOrDefault(1, 0L).intValue()
        );
    }
}