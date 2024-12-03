import axios from "axios";

const API_BASE_URL = "http://localhost:8080/mental-health/api/v1/sse";

export const getAllSSEbyRole = async (accessToken: string, role: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/onlineUsersByRole`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
      params: {
        role: role,
      },
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching online users by role:",
        error.response?.data
      );
    } else {
      console.error("Error fetching online users by role:", error);
    }
    throw error;
  }
};
