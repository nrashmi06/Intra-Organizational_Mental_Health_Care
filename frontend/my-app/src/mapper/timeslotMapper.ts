const BASE_API = `${process.env.NEXT_PUBLIC_BACKEND_URL}/mental-health/api/v1/time-slots`;
export const ADMIN_ID_PATH = (userId: string) => `/${userId}`; // Dynamic placeholder for adminId
export const TIME_SLOT_ID_PATH = (timeSlotId: string) => `/${timeSlotId}`; // Dynamic placeholder for timeSlotId

export const TIME_SLOT_API_ENDPOINTS = {
  CREATE_TIME_SLOTS_IN_DATE_RANGE: (userId: string) =>
    `${BASE_API}${ADMIN_ID_PATH(userId)}/date-range`, // Create time slots for a single date or date range
  UPDATE_TIME_SLOTS_BY_ID: (userId: string, timeSlotId: string) =>
    `${BASE_API}${ADMIN_ID_PATH(userId)}${TIME_SLOT_ID_PATH(timeSlotId)}`, // Update time slots by ID
  DELETE_TIME_SLOTS_IN_DATE_RANGE: (adminId: string) =>
    `${BASE_API}${ADMIN_ID_PATH(adminId)}/date-range`, // Delete time slots in a specific date range
  GET_TIME_SLOTS_BY_ADMIN_IN_DATE_RANGE: (adminId: string) =>
    `${BASE_API}${ADMIN_ID_PATH(adminId)}/date-range`, // Get time slots by admin and date range
  DELETE_TIME_SLOT_BY_ID: (userId: string, timeSlotId: string) =>
    `${BASE_API}${ADMIN_ID_PATH(userId)}${TIME_SLOT_ID_PATH(timeSlotId)}`, // Delete a specific time slot by ID
};
