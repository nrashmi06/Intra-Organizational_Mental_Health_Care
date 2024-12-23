// src/service/session/getSessionFeedback.ts
import { FEEDBACK_API_ENDPOINTS } from "@/mapper/feedbackMapper"; // Import the feedback mapper

export const getSessionFeedback = async (sessionId: string, token: string) => {
  try {
    const url = FEEDBACK_API_ENDPOINTS.GET_FEEDBACK_BY_SESSION(sessionId); // Use the mapped endpoint

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching session feedback:", error);
    throw error;
  }
};
