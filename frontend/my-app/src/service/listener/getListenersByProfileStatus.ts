import axios from "axios";

const API_BASE_URL = "http://localhost:8080/mental-health/api/v1/listeners";

export const getListenersByProfileStatus = async (
  token: string,
  type: string
) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        type: type,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching listeners by profile status:",
        error.response?.data
      );
    } else {
      console.error("Error fetching listeners by profile status:", error);
    }
    throw error;
  }
};
