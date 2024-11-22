package com.dbms.mentalhealth.urlMapper;


public class EmergencyHelplineUrlMapping {

    private static final String BASE_API = "/api/v1/emergency-helpline";
    private static final String HELPLINE_ID_PATH = "/{helplineId}"; // Placeholder for helplineId

    public static final String GET_ALL_EMERGENCY_HELPLINES = BASE_API; // Get all emergency helplines
    public static final String ADD_EMERGENCY_HELPLINE = BASE_API; // Add a new emergency helpline
    public static final String UPDATE_EMERGENCY_HELPLINE = BASE_API + HELPLINE_ID_PATH; // Update an emergency helpline
    public static final String DELETE_EMERGENCY_HELPLINE = BASE_API + HELPLINE_ID_PATH; // Delete an emergency helpline
}
