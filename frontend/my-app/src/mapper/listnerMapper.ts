
const BASE_API = `${process.env.NEXT_PUBLIC_BACKEND_URL}/mental-health/api/v1/listener-applications`;

export const LISTENER_APPLICATION_API_ENDPOINTS = {
  SUBMIT_APPLICATION: `${BASE_API}/submit`, // Submit a new listener application
  GET_APPLICATION_BY_ID: `${BASE_API}/application`, // Get listener application by ID
  DELETE_APPLICATION: (applicationId: string) => `${BASE_API}/${applicationId}`, // Delete listener application by ID
  UPDATE_APPLICATION: (applicationId: string) => `${BASE_API}/${applicationId}`, // Update listener application details
  GET_ALL_APPLICATIONS: `${BASE_API}`, // Get all listener applications
  UPDATE_APPLICATION_STATUS: (applicationId: string) => `${BASE_API}/${applicationId}/update-status`, // Update listener application status
  GET_APPLICATION_BY_APPROVAL_STATUS: `${BASE_API}`, // Get listener applications by approval status
  GET_APPLICATION_BY_LISTENERS_USER_ID: (userId: string) => `${BASE_API}/listener/${userId}`, // Get listener applications by listener's user ID
};
