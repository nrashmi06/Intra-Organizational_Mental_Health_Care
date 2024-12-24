// src/service/session/getSessionListByRole.ts
import { SESSION_API_ENDPOINTS } from "@/mapper/sessionMapper"; // Import the session mapper

export const getSessionListByRole = async (id: string, role: string, token: string) => {
  try {
    const url = `${SESSION_API_ENDPOINTS.GET_SESSIONS_BY_USER_ID_OR_LISTENER_ID(id)}?role=${role}`; // Use the mapped URL

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    return response;
  } catch (error) {
    console.error("Error fetching listener sessions:", error);
    throw error; // Re-throw the error for further handling
  }
};
