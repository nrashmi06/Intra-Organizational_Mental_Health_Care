package com.dbms.mentalhealth.urlMapper;

public class ListenerApplicationUrlMapping {

    private ListenerApplicationUrlMapping() {
        throw new IllegalStateException("Utility class");
    }

    private static final String BASE_API = "/api/v1/listener-applications";
    private static final String APPLICATION_ID_PATH = "/{applicationId}"; // Placeholder for applicationId
    private static final String USER_ID_PATH = "/{userId}"; // Placeholder for userId
    // Listener application endpoints
    public static final String SUBMIT_APPLICATION = BASE_API + "/submit"; // Submit a new listener application
    public static final String GET_APPLICATION_BY_ID = BASE_API + "/application"; // Get listener application by ID
    public static final String DELETE_APPLICATION = BASE_API + APPLICATION_ID_PATH; // Delete listener application by ID
    public static final String UPDATE_APPLICATION = BASE_API + APPLICATION_ID_PATH; // Update listener application details
    public static final String GET_ALL_APPLICATIONS = BASE_API; // Get all listener applications
    public static final String UPDATE_APPLICATION_STATUS = BASE_API + APPLICATION_ID_PATH + "/update-status"; // Update listener application status
    public static final String GET_APPLICATION_BY_APPROVAL_STATUS = BASE_API + "/status"; // Get listener applications by approval status
    public static final String GET_APPLICATION_BY_LISTENERS_USER_ID = BASE_API + "/listener" + USER_ID_PATH; // Get listener applications by listener's user ID
}