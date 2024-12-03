//to suspend or unsuspend

import axios from "axios";

const API_BASE_URL = "http://localhost:8080/mental-health/api/v1/listeners";

export const changeStatus = async (
  listenerId: number,

  token: string,
  action: string
) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/suspend/${listenerId}?action=${action}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error suspending listener:", error.response?.data);
    } else {
      console.error("Error suspending listener:", error);
    }
    throw error;
  }
};
