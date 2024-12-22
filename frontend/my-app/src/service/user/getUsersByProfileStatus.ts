import axios from "axios";
import { API_ENDPOINTS } from "@/mapper/userMapper"; // Import API endpoints from the mapper

export const getUsersByProfileStatus = async (
  token: string,
  status: string
) => {
  try {
    const response = await axios.get(API_ENDPOINTS.GET_ALL_USERS_BY_PROFILE_STATUS, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        status: status,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching users by profile status:", error.response?.data);
    } else {
      console.error("Error fetching users by profile status:", error);
    }
  }
};
