package com.dbms.mentalhealth.urlMapper;

public class TimeSlotUrlMapping {
    private TimeSlotUrlMapping() {
        throw new IllegalStateException("Utility class");
    }

    private static final String BASE_API = "/api/v1/time-slots";
    private static final String ADMIN_ID_PATH = "/{adminId}"; // Placeholder for adminId
    private static final String TIME_SLOT_ID_PATH = "/{timeSlotId}"; // Placeholder for timeSlotId

    // Time slot related endpoints
    public static final String CREATE_TIME_SLOTS_IN_DATE_RANGE = BASE_API + ADMIN_ID_PATH + "/date-range"; // Create time slots for a single date or date range
    public static final String UPDATE_TIME_SLOTS = BASE_API + ADMIN_ID_PATH; // Update time slots for a single date or date range
    public static final String DELETE_TIME_SLOTS_IN_DATE_RANGE = BASE_API + ADMIN_ID_PATH + "/date-range"; // Delete a specific time slot
    public static final String BOOK_TIME_SLOT = BASE_API + TIME_SLOT_ID_PATH; // Book a specific time slot (user selects the slot)
    public static final String GET_TIME_SLOTS_BY_ADMIN_IN_DATE_RANGE = BASE_API + ADMIN_ID_PATH + "/date-range"; // Get all time slots by admin ID and date range
}