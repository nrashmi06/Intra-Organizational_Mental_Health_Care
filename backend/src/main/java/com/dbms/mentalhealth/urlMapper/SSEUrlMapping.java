package com.dbms.mentalhealth.urlMapper;

public class SSEUrlMapping {

    private SSEUrlMapping() {
        throw new IllegalStateException("Utility class");
    }
    public static final String BASE_URL = "/api/v1/sse";
    public static final String SSE_ONLINE_USERS = BASE_URL + "/onlineUsers";
    public static final String SSE_ONLINE_USERS_BY_ROLE = BASE_URL + "/onlineUsersByRole";//for admins
}
