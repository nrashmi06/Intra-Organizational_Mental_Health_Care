import axiosInstance from "@/utils/axios";
import { SESSION_API_ENDPOINTS } from "@/mapper/sessionMapper"; 

export const getSessionMessages = async (
  sessionId: string,
  token: string,
  signal?: AbortSignal
) => {
  try {
    const url = SESSION_API_ENDPOINTS.GET_MESSAGES_BY_SESSION_ID(sessionId);

    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      signal, 
    });

    if (response.status === 404) {
      return response;
    }
    return response.data; 
  } catch (error) {
    console.error("Error fetching session messages:", error);
  }
};
