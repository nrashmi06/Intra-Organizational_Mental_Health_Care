import axios from "axios";

const API_BASE_URL = "http://localhost:8080/mental-health/api/v1/sessions";

export const initiateSession = async (
  listenerId: string,
  message: string,
  token: string
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}/initiate/${listenerId}`,
      { message },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error initiating session:", error.response?.data);
    } else {
      console.error("Error initiating session:", error);
    }
    throw error;
  }
};
