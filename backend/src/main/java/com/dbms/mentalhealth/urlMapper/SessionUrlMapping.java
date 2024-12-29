package com.dbms.mentalhealth.urlMapper;

public class SessionUrlMapping {

    private SessionUrlMapping() {
        throw new IllegalStateException("Utility class");
    }

    private static final String BASE_API = "/api/v1/sessions";
    private static final String SESSION_ID_PATH = "/{sessionId}";
    private static final String LISTENER_ID_PATH = "/{listenerId}";
    private static final String USER_ID_PATH = "/{userId}";

    public static final String INITIATE_SESSION = BASE_API + "/initiate" + LISTENER_ID_PATH;
    public static final String UPDATE_SESSION_STATUS = BASE_API + "/status" + USER_ID_PATH;
    public static final String END_SESSION = BASE_API + "/end" + SESSION_ID_PATH;
    public static final String GET_SESSION_BY_ID = BASE_API + SESSION_ID_PATH;
    public static final String GET_MESSAGES_BY_SESSION_ID = BASE_API + "/messages" + SESSION_ID_PATH;
    public static final String AVG_SESSION_DURATION = BASE_API + "/avg-duration";
    public static final String GET_SESSIONS_BY_FILTERS = BASE_API + "/filter";
}