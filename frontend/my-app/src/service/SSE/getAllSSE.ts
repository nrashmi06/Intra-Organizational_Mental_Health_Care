import axios from "axios";

const API_BASE_URL = "http://localhost:8080/mental-health/api/v1/sse";

export const getAllOnlineUsers = async (accessToken: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/allOnlineUsers`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching all online users:", error.response?.data);
    } else {
      console.error("Error fetching all online users:", error);
    }
    throw error;
  }
};
