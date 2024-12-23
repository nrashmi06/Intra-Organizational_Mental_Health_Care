import axios from "axios";
import { LISTENER_API_ENDPOINTS } from "@/mapper/listenerProfileMapper";

export const getListenersByProfileStatus = async (
  token: string,
  status: string
) => {
  try {
    const response = await axios.get(
      LISTENER_API_ENDPOINTS.GET_ALL_LISTENERS_BY_STATUS(status),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
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