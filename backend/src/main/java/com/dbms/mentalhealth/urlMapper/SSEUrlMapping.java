package com.dbms.mentalhealth.urlMapper;

public class SSEUrlMapping {

    private SSEUrlMapping() {
        throw new IllegalStateException("Utility class");
    }
    public static final String BASE_URL = "/api/v1/sse";
    public static final String SSE_ALL_ONLINE_USERS = BASE_URL + "/allOnlineUsers";
    public static final String SSE_ONLINE_USERS_COUNT_BY_ROLE = BASE_URL + "/onlineUsersByRole";//for admins
    public static final String SSE_ONLINE_LISTENERS = BASE_URL + "/onlineListeners";
    public static final String SSE_ONLINE_ADMINS = BASE_URL + "/onlineAdmins";
    public static final String SSE_ONLINE_USERS = BASE_URL + "/onlineUsers";
    public static final String HEARTBEAT = BASE_URL + "/heartbeat";
}
