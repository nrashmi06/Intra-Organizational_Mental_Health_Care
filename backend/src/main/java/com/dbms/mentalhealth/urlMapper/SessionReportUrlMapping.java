package com.dbms.mentalhealth.urlMapper;

public class SessionReportUrlMapping {

    private SessionReportUrlMapping() {
        throw new IllegalStateException("Utility class");
    }

    private static final String BASE_API = "/api/v1/session-report";
    private static final String REPORT_ID_PATH = "/{reportId}";
    private static final String SESSION_ID_PATH = "/{sessionId}";
    private static final String USER_ID_PATH = "/{userId}";

    public static final String CREATE_REPORT = BASE_API;
    public static final String GET_REPORT_BY_SESSION_ID = BASE_API + "/session" + SESSION_ID_PATH;
    public static final String GET_REPORT_BY_ID = BASE_API + "/report" + REPORT_ID_PATH;
    public static final String GET_ALL_USER_REPORTS = BASE_API + "/user" + USER_ID_PATH;
    public static final String GET_ALL_REPORT_SUMMARY = BASE_API + "/summary";

}