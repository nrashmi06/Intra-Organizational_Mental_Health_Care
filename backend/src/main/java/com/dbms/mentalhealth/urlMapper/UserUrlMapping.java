package com.dbms.mentalhealth.urlMapper;

public class UserUrlMapping {
    private UserUrlMapping() {
        throw new IllegalStateException("Utility class");
    }
    private static final String BASE_API = "/api/v1/users";
    private static final String USER_ID_PATH = "/{userId}"; // Placeholder for userId

    public static final String USER_REGISTER = BASE_API + "/register"; // Register a new user
    public static final String USER_LOGIN = BASE_API + "/login"; // User login
    public static final String USER_LOGOUT = BASE_API + "/logout"; // User logout
    public static final String VERIFY_EMAIL = BASE_API + "/verify-email"; // Verify user email
    public static final String RESEND_VERIFICATION_EMAIL = BASE_API + "/resend-verification-email"; // Resend verification email
    public static final String RENEW_TOKEN = BASE_API + "/renew-token"; // Refresh JWT token
    // User profile management endpoints
    public static final String GET_ALL_USERS_BY_PROFILE_STATUS = BASE_API + "/all"; // Get all users by profile status
    public static final String GET_USER_BY_ID = BASE_API + USER_ID_PATH; // Get user by ID
    public static final String UPDATE_USER = BASE_API + USER_ID_PATH; // Update user details
    public static final String DELETE_USER = BASE_API + USER_ID_PATH; // Delete user
    public static final String SUSPEND_USER_OR_UN_SUSPEND_USER = BASE_API + "/suspend" + USER_ID_PATH; // Suspend user

    // Password management endpoints
    public static final String CHANGE_PASSWORD = BASE_API + USER_ID_PATH + "/change-password"; // Change user password (requires userId)
    public static final String FORGOT_PASSWORD = BASE_API + "/forgot-password"; // Forgot password (trigger reset, no userId)
    public static final String RESET_PASSWORD = BASE_API + "/reset-password"; // Reset password (requires JWT for user verification)
}
