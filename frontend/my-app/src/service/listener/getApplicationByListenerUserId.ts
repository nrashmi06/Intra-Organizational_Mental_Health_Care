import axiosInstance from "@/utils/axios";
import { LISTENER_APPLICATION_API_ENDPOINTS } from "@/mapper/listnerMapper"; // Import the URL mapper

export const getApplicationByListenerUserId = async (
  userId: string,
  token: string
) => {
  try {
    const response = await axiosInstance.get(
      LISTENER_APPLICATION_API_ENDPOINTS.GET_APPLICATION_BY_LISTENERS_USER_ID(userId.toString()),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Return the parsed data
  } catch (error: any) {
    console.error("Error fetching listener application:", error);

    // Handle Axios-specific errors
    if (error.response) {
      throw new Error(
        `Error fetching listener application: ${error.response.data?.message || error.response.statusText}`
      );
    } else if (error.request) {
      throw new Error("No response received from the server. Please try again.");
    } else {
      throw new Error(error.message || "An unexpected error occurred.");
    }
  }
};
