import axiosInstance from "@/utils/axios"; // Import your Axios instance
import { API_ENDPOINTS } from "@/mapper/userMapper"; // Adjust path as per your project structure

export const getUserDetails = async (userId: string, token: string) => {
  try {
    // Use the dynamic endpoint from API_ENDPOINTS
    const url = API_ENDPOINTS.GET_USER_BY_ID(userId);

    // Send GET request using axiosInstance
    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log("DATA:", response.data); // Log the response data

    return response.data; // Return the response data
  } catch (error : any) {
    // Error handling
    if (error.response) {
      // If error has a response (e.g., 400, 404, etc.)
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
