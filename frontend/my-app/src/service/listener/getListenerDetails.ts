//get details of a listener from the listener Table using the userId of the listener
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/mental-health/api/v1/listeners";

export const getListenerDetails = async (id: number, token: string) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/details`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        type: "userId",
        id: id,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching listener details:", error.response?.data);
    } else {
      console.error("Error fetching listener details:", error);
    }
    throw error;
  }
};
