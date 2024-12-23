// src/mapper/sessionReportMapper.ts

const BASE_API = `${process.env.NEXT_PUBLIC_BACKEND_URL}/mental-health/api/v1/session-report`;

export const REPORT_API_ENDPOINTS = {
  CREATE_REPORT: BASE_API, // Create a new session report
  GET_REPORT_BY_SESSION_ID: (sessionId: string) => `${BASE_API}/session/${sessionId}`, // Get report by session ID
  GET_REPORT_BY_REPORT_ID: (reportId: string) => `${BASE_API}/report/${reportId}`, // Get session report by report ID
  GET_ALL_USER_REPORTS_BY_USER_ID: (userId: string) => `${BASE_API}/user/${userId}`, // Get all user reports by user ID
  GET_REPORT_SUMMARY: `${BASE_API}/summary`, // Get summary of all reports
};
