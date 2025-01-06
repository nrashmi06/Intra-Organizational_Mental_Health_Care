import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/mapper/userMapper";
import axios from "axios";

export const changeStatus = async (
  userId: string,
  token: string,
  action: string
) => {
  try {
    const response = await axiosInstance.put(
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
  }
};
