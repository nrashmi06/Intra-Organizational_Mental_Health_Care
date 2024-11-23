package com.dbms.mentalhealth.urlMapper;

public class AdminSettingsUrlMapping {

    private static final String BASE_API = "/api/v1/admin-settings";
    private static final String ADMIN_ID_PATH = "/{adminId}"; // Placeholder for adminId

    // Admin settings endpoints
    public static final String CREATE_ADMIN_SETTINGS = BASE_API; // POST to create settings for the admin
    public static final String GET_ADMIN_SETTINGS = BASE_API ; // GET to retrieve settings for a specific admin
    public static final String UPDATE_ADMIN_SETTINGS = BASE_API ; // PUT to update settings for a specific admin
    public static final String DELETE_ADMIN_SETTINGS = BASE_API; // DELETE to remove settings for a specific admin
}
