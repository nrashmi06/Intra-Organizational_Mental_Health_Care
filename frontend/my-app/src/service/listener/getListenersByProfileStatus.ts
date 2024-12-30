import { LISTENER_API_ENDPOINTS } from "@/mapper/listenerProfileMapper";
import axios from "axios";

export const getListenersByProfileStatus = async ({
  page = 0,
  size = 1,
  status = "active",
  search,
  token,
}: {
  page?: number;
  size?: number;
  status?: string;
  search?: string;
  token: string;
}) => {
  try {
    const response = await axios.get(
      LISTENER_API_ENDPOINTS.GET_ALL_LISTENERS_BY_STATUS,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          size,
          status,
          ...(search ? { search } : {}),
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching listeners:", error);
    throw error;
  }
};
