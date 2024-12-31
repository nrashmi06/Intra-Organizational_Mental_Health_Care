// src/service/session/getSessionListByRole.ts
import axiosInstance from '@/utils/axios'// Import the Axios instance
import { SESSION_API_ENDPOINTS } from "@/mapper/sessionMapper"; // Import the session mapper

export const getSessionListByRole = async (
  id: string,
  role: string,
  token: string
) => {
  try {
    const url = `${SESSION_API_ENDPOINTS.GET_SESSIONS_BY_USER_ID_OR_LISTENER_ID(
      id
    )}?role=${role}`; // Construct the API endpoint

    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data; // Return the response data
  } catch (error) {
    console.error("Error fetching listener sessions:", error);
  }
};
