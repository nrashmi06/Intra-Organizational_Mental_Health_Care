// src/service/session/getSessionMessages.ts
import axiosInstance from '@/utils/axios' // Import the Axios instance
import { SESSION_API_ENDPOINTS } from "@/mapper/sessionMapper"; // Import the session mapper

export const getSessionMessages = async (
  sessionId: string,
  token: string,
  signal?: AbortSignal
) => {
  try {
    const url = SESSION_API_ENDPOINTS.GET_MESSAGES_BY_SESSION_ID(sessionId); // Use the mapped URL

    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      signal, // Pass the abort signal for request cancellation
    });

    return response.data; // Return the response data
  } catch (error) {
    console.error("Error fetching session messages:", error);
  }
};
