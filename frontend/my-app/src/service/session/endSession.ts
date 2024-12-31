import axiosInstance from "@/utils/axios";
import { SESSION_API_ENDPOINTS } from "@/mapper/sessionMapper"; // Import the mapper

export const endSession = async (sessionId: number, accessToken: string) => {
  const url = SESSION_API_ENDPOINTS.END_SESSION(sessionId.toString()); // Get the endpoint from the mapper

  try {
    const response = await axiosInstance.post(
      url,
      {}, // Empty body for the POST request
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error ending session:", error);
    throw error;
  }
};
