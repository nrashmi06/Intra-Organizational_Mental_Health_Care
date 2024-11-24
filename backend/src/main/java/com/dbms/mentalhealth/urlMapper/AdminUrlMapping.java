package com.dbms.mentalhealth.urlMapper;

public class AdminUrlMapping {

    private static final String BASE_API = "/api/v1/admins";
    private static final String ADMIN_ID_PATH = "/{adminId}"; // Placeholder for adminId

    // Admin profile endpoints
    public static final String CREATE_ADMIN_PROFILE = BASE_API; // POST to create a new admin profile
    public static final String GET_ADMIN_PROFILE = BASE_API + ADMIN_ID_PATH; // GET to retrieve admin profile by ID
    public static final String UPDATE_ADMIN_PROFILE = BASE_API + ADMIN_ID_PATH; // PUT to update admin profile details
    public static final String GET_ALL_ADMINS = BASE_API; // GET to retrieve all admin profiles
    public static final String DELETE_ADMIN_PROFILE = BASE_API + ADMIN_ID_PATH; // DELETE to delete admin profile by ID
}
