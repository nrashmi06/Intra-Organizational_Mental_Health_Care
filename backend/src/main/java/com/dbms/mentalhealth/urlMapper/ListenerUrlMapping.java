package com.dbms.mentalhealth.urlMapper;

public class ListenerUrlMapping {

    private ListenerUrlMapping() {
        throw new IllegalStateException("Utility class");
    }

    public static final String BASE_URL = "/api/v1/listeners";

    public static final String LISTENER_BY_ID = BASE_URL + "/details";
    public static final String ALL_LISTENERS = BASE_URL + "/all";
    public static final String SUSPEND_OR_UN_SUSPEND_LISTENER = BASE_URL + "/suspend/{listenerId}";
}