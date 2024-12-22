//to suspend or unsuspend

import axios from "axios";

const API_BASE_URL = "http://localhost:8080/mental-health/api/v1/users";

export const changeStatus = async (
  userId: string,
  token: string,
  action: string
) => {
  try {
    const response = await axios.put(
      `${API_BASE_URL}/suspend/${userId}?action=${action}`,
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
      console.error("Error suspending user:", error.response?.data);
    } else {
      console.error("Error suspending user:", error);
    }
    throw error;
  }
};
