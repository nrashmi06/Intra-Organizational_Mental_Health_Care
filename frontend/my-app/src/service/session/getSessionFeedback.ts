// src/service/session/getSessionFeedback.ts
import { FEEDBACK_API_ENDPOINTS } from "@/mapper/feedbackMapper"; // Import the feedback mapper

export const getSessionFeedback = async (sessionId: string, token: string, signal?: AbortSignal) => {
  try {
    const url = FEEDBACK_API_ENDPOINTS.GET_FEEDBACK_BY_SESSION(sessionId); // Use the mapped endpoint

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      signal
    });

    if(response.status===404) {
      return response;
    }
    return await response.json();
  } catch (error) {
    console.error("Error fetching session feedback:", error);
    throw error;
  }
};
