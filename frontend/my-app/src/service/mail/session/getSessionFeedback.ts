import axiosInstance from "@/utils/axios";
import { FEEDBACK_API_ENDPOINTS } from "@/mapper/feedbackMapper";

export const getSessionFeedback = async (
  sessionId: string,
  token: string,
  signal?: AbortSignal
) => {
  try {
    const url = FEEDBACK_API_ENDPOINTS.GET_FEEDBACK_BY_SESSION(sessionId);

    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      signal,
    });

    return response.data; 
  } catch (error) {
    console.error("Error fetching session feedback:", error);
  }
};
