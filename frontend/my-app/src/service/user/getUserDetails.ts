import axiosInstance from "@/utils/axios"; 
import { API_ENDPOINTS } from "@/mapper/userMapper"; 

export const getUserDetails = async (userId: string, token: string) => {
  try {
    const url = API_ENDPOINTS.GET_USER_BY_ID(userId);

    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data; 
  } catch (error : any) {
    if (error.response) {
      if (error.response.status === 404) {
        throw new Error("User not found.");
      } else if (error.response.status === 401) {
        throw new Error("Unauthorized access. Please log in again.");
      } else {
        throw new Error(`Error: ${error.response.statusText || "Unknown error occurred."}`);
      }
    } else {
      // Network or unknown error
      console.error("Error fetching user details:", error.message || error);
      throw new Error("Failed to fetch user details.");
    }
  }
};
