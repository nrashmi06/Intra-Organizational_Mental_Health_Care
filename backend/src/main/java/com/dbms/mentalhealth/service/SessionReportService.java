package com.dbms.mentalhealth.service;


import com.dbms.mentalhealth.dto.session.request.SessionReportRequestDTO;
import com.dbms.mentalhealth.dto.session.response.SessionReportResponseDTO;
import com.dbms.mentalhealth.dto.session.response.SessionReportSummaryResponseDTO;

import java.util.List;

public interface SessionReportService {
    SessionReportResponseDTO createReport(SessionReportRequestDTO requestDTO);
    List<SessionReportResponseDTO> getReportBySessionId(Integer sessionId);
    SessionReportResponseDTO getReportById(Integer reportId);
    List<SessionReportResponseDTO> getAllUserReports(Integer userId);
    SessionReportSummaryResponseDTO getReportSummary();
}