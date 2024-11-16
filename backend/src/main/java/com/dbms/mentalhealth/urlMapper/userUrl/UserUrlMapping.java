package com.dbms.mentalhealth.urlMapper.userUrl;

public class UserUrlMapping {
    public static final String BASE_API = "/api/v1";

    // User authentication
    public static final String USER_REGISTER = BASE_API + "/users/register"; // Register a new user
    public static final String USER_LOGIN = BASE_API + "/users/login"; // User login
    public static final String USER_LOGOUT = BASE_API + "/users/logout"; // User logout
    public static final String VERIFY_EMAIL = BASE_API + "/users/verify-email"; // Verify user email
    public static final String RESEND_VERIFICATION_EMAIL = BASE_API + "/users/resend-verification-email"; // Resend verification email

    // User profile management
    public static final String GET_USER_BY_ID = BASE_API + "/users/{userId}"; // Get user by ID
    public static final String UPDATE_USER = BASE_API + "/users/{userId}"; // Update user details
    public static final String DELETE_USER = BASE_API + "/users/{userId}"; // Delete user

    // Password management
    public static final String CHANGE_PASSWORD = BASE_API + "/users/{userId}/change-password";  // Change user password
    public static final String FORGOT_PASSWORD = BASE_API + "/users/forgot-password";          // Forgot password (trigger reset)
    public static final String RESET_PASSWORD = BASE_API + "/users/reset-password"; // Reset password (after forgetting it)
}
