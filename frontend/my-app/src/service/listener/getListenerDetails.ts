import axios from "axios";
import { LISTENER_API_ENDPOINTS } from "@/mapper/listenerProfileMapper";
import axiosInstance from "@/utils/axios";

export const getListenerDetails = async (id: string, token: string, type: string) => {
  try {
    const response = await axiosInstance.get(
      LISTENER_API_ENDPOINTS.GET_LISTENER_BY_ID_OR_TYPE(type, id),
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching listener details:", error.response?.data);
    } else {
      console.error("Error fetching listener details:", error);
    }
  }
};

