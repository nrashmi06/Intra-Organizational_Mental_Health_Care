//to suspend or unsuspend

import axios from "axios";
import { API_ENDPOINTS } from "@/mapper/userMapper";

export const changeStatus = async (
  userId: string,
  token: string,
  action: string
) => {
  try {
    const response = await axios.put(
      `${API_ENDPOINTS.SUSPEND_USER(userId)}?action=${action}`,
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
