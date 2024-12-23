import axios from "axios";
import { LISTENER_API_ENDPOINTS } from "@/mapper/listenerProfileMapper";

export const changeStatus = async (
  listenerId: string,
  token: string,
  action: string
) => {
  try {
    const response = await axios.put(
      LISTENER_API_ENDPOINTS.SUSPEND_OR_UNSUSPEND_LISTENER(listenerId, action),
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