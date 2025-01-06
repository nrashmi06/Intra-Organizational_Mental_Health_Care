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
        console.error("User not found:", error.response.data?.message || error.message);
      } else if (error.response.status === 401) {
        console.error("Unauthorized request:", error.response.data?.message || error.message);
      } else {
        console.error("Error fetching user details:", error.response.data?.message || error.message);
      }
    } else {
      console.error("Error fetching user details:", error.message || error);
    }
  }
};
