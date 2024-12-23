const BASE_API = `${process.env.NEXT_PUBLIC_BACKEND_URL}/mental-health/api/v1/admins`;

export const ADMIN_PROFILE_API_ENDPOINTS = {
  CREATE_ADMIN_PROFILE: `${BASE_API}`, // Create a new admin profile
  GET_ADMIN_PROFILE:`${BASE_API}/profile`, // Get admin profile by ID
  GET_ALL_ADMIN_PROFILE: `${BASE_API}`, // Get all admin profiles
  UPDATE_ADMIN_PROFILE:  `${BASE_API}/profile`, // Update admin profile details
  DELETE_ADMIN_PROFILE: (userId: string) => `${BASE_API}/${userId}`, // Delete admin profile
};