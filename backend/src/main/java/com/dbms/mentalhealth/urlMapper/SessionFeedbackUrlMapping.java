package com.dbms.mentalhealth.urlMapper;

public class SessionFeedbackUrlMapping {

    private SessionFeedbackUrlMapping() {
        throw new IllegalStateException("Utility class");
    }

    private static final String BASE_API = "/api/v1/session-feedback";
    private static final String SESSION_ID_PATH = "/{sessionId}";
    private static final String FEEDBACK_ID_PATH = "/{feedbackId}";
    private static final String LISTENER_ID_PATH = "/{listenerId}";

    public static final String CREATE_FEEDBACK = BASE_API;
    public static final String GET_FEEDBACK_BY_SESSION_ID = BASE_API + "/session" + SESSION_ID_PATH;
    public static final String GET_FEEDBACK_BY_ID = BASE_API + "/feedback" + FEEDBACK_ID_PATH;
    public static final String GET_ALL_LISTENER_FEEDBACK = BASE_API + "/listener" + "/{id}"; // New URL mapping
    public static final String GET_ALL_FEEDBACK_SUMMARY = BASE_API + "/summary"; // New URL mapping

}