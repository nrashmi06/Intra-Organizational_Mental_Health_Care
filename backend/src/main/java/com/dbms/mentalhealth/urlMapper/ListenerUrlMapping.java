package com.dbms.mentalhealth.urlMapper;

public class ListenerUrlMapping {

    private ListenerUrlMapping() {
        throw new IllegalStateException("Utility class");
    }


    public static final String BASE_URL = "/api/v1/listeners";
    public static final String LISTENER_ID_PATH = "/{listenerId}";

    public static final String LISTENER_BY_ID = BASE_URL + "/details";
    public static final String ALL_LISTENERS = BASE_URL + "/all";
    public static final String NEW_LISTENER = BASE_URL + "/new";
    public static final String EDIT_LISTENER = BASE_URL + "/edit/{listenerId}";
    public static final String REMOVE_LISTENER = BASE_URL + "/remove/{listenerId}";
}