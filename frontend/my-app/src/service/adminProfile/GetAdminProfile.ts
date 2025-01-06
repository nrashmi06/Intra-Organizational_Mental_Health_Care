import axiosInstance from '@/utils/axios';
import { ADMIN_PROFILE_API_ENDPOINTS } from '@/mapper/adminProfileMapper'; 

export const fetchAdminProfile = async (token: string, userId?: string) => {
  try {
    const url = userId
      ? `${ADMIN_PROFILE_API_ENDPOINTS.GET_ADMIN_PROFILE}?userId=${userId}`
      : ADMIN_PROFILE_API_ENDPOINTS.GET_ADMIN_PROFILE;

    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      console.warn("Profile not found (404). Returning null.");
      return null; 
    }
    console.error("Error fetching admin profile:", error);
  }
};
