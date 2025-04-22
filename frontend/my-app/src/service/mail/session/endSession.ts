import axiosInstance from "@/utils/axios";
import { SESSION_API_ENDPOINTS } from "@/mapper/sessionMapper"; 

export const endSession = async (sessionId: number, accessToken: string) => {
  const url = SESSION_API_ENDPOINTS.END_SESSION(sessionId.toString());
  try {
    const response = await axiosInstance.post(
      url,
      {}, 
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error ending session:", error);
  }
};
