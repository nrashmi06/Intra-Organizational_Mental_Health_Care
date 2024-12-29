package com.dbms.mentalhealth.urlMapper;

public class AppointmentUrlMapping {

    private AppointmentUrlMapping() {
        throw new IllegalStateException("Utility class");
    }

    private static final String BASE_API = "/api/v1/appointments";
    private static final String APPOINTMENT_ID_PATH = "/{appointmentId}"; // Placeholder for appointmentId

    public static final String BOOK_APPOINTMENT = BASE_API;
    public static final String GET_APPOINTMENTS_BY_USER = BASE_API + "/user"; // Get all appointments by user
    public static final String GET_APPOINTMENT_BY_ID = BASE_API + APPOINTMENT_ID_PATH; // Get a specific appointment by ID
    public static final String UPDATE_APPOINTMENT_STATUS = BASE_API + APPOINTMENT_ID_PATH + "/status"; // Update appointment status (e.g., confirm/cancel)
    public static final String CANCEL_APPOINTMENT = BASE_API + APPOINTMENT_ID_PATH + "/cancel"; // Cancel an appointment with a reason
    public static final String GET_APPOINTMENTS_BY_DATE_RANGE = BASE_API + "/date"; // Get all appointments within a date range
    public static final String GET_ADMIN_APPOINTMENTS = BASE_API + "/filter"; //past and future appointments for admin
}
