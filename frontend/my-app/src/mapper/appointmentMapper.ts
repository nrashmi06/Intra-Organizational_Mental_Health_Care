const BASE_API = `${process.env.NEXT_PUBLIC_BACKEND_URL}/mental-health/api/v1/appointments`;

export const APPOINTMENT_API_ENDPOINTS = {
  BOOK_APPOINTMENT: `${BASE_API}`, // Book a new appointment
  GET_APPOINTMENTS_BY_USER: `${BASE_API}/user`, // Get all appointments by user
  GET_APPOINTMENTS_BY_ADMIN: `${BASE_API}/admin`, // Get all appointments by admin
  GET_APPOINTMENT_BY_ID: (appointmentId: string) => `${BASE_API}/${appointmentId}`, // Get a specific appointment by ID
  UPDATE_APPOINTMENT_STATUS: (appointmentId: string) => `${BASE_API}/${appointmentId}/status`, // Update appointment status (e.g., confirm/cancel)
  CANCEL_APPOINTMENT: (appointmentId: string) => `${BASE_API}/${appointmentId}/cancel`, // Cancel an appointment with a reason
  GET_APPOINTMENTS_BY_DATE_RANGE: `${BASE_API}/date`, // Get all appointments within a date range
  GET_CURRENT_ADMIN_UPCOMING_APPOINTMENTS: `${BASE_API}/upcoming`, // Get all upcoming appointments for the current admin
  GET_CURRENT_ADMIN_UPCOMING_APPOINTMENTS_BY_STATUS: `${BASE_API}/status`, // Get all upcoming appointments for the current admin by status
};
