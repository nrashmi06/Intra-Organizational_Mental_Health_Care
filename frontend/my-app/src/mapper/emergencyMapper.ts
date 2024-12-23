
const BASE_API = `${process.env.NEXT_PUBLIC_BACKEND_URL}/mental-health/api/v1/emergency-helpline`;

export const EMERGENCY_API_ENDPOINTS = {
  CREATE_EMERGENCY: `${BASE_API}`, // Create a new emergency helpline
  GET_ALL_EMERGENCY: `${BASE_API}`, // Get emergency helpline by ID
  UPDATE_EMERGENCY: (emergencyId : string) => `${BASE_API}/${emergencyId}`, // Update emergency helpline details
  DELETE_EMERGENCY: (emergencyId : string) => `${BASE_API}/${emergencyId}`, // Delete emergency helpline
};