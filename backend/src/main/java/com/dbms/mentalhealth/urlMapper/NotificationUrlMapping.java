package com.dbms.mentalhealth.urlMapper;

public class NotificationUrlMapping {

    private NotificationUrlMapping() {
        throw new IllegalStateException("Utility class");
    }
    // Base path for all notification-related APIs
    private static final String BASE_API = "/api/v1/sse/notifications";
    // Mappings for notification management
    public static final String SUBSCRIBE_NOTIFICATIONS = BASE_API + "/subscribe"; // Subscribe to notifications
}