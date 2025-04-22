import axiosInstance from "@/utils/axios";
import { FEEDBACK_API_ENDPOINTS } from "@/mapper/feedbackMapper";

export const getSessionFeedback = async (
  sessionId: string,
  token: string,
  controller?: AbortController
) => {
  try {
    const url = FEEDBACK_API_ENDPOINTS.GET_FEEDBACK_BY_SESSION(sessionId);

    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (controller?.signal.aborted) {
      console.warn("Request aborted manually.");
      return;
    }

    return response.data;
  } catch (error: any) {
    if (controller?.signal.aborted) {
      console.warn("Request was aborted.");
    } else {
      console.error("Error fetching session feedback:", error);
    }
  }
};