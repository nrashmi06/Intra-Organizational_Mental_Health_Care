// src/service/session/getSessionMessages.ts
import { SESSION_API_ENDPOINTS } from "@/mapper/sessionMapper"; // Import the session mapper

export const getSessionMessages = async (sessionId: string, token: string, signal?: AbortSignal) => {
  try {
    const url = SESSION_API_ENDPOINTS.GET_MESSAGES_BY_SESSION_ID(sessionId); // Use the mapped URL

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
    console.error("Error fetching session messages:", error);
    throw error;
  }
};
