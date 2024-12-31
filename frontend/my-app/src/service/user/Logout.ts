import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/mapper/userMapper";
export const logout = async (accessToken: string) => {
  try {
    const response = await axiosInstance.post(
      `${API_ENDPOINTS.LOGOUT}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );
    console.log("User logged out successfully");
    console.log(response)
   return response;
  } catch (error) {
    console.error("Error logging out the user:", error);
  }
};