import axiosInstance from "@/utils/axios";
import { LISTENER_APPLICATION_API_ENDPOINTS } from "@/mapper/listnerMapper";

export const getApplicationByListenerUserId = async (
  userId: string,
  token: string
) => {
  try {
    const response = await axiosInstance.get(
      LISTENER_APPLICATION_API_ENDPOINTS.GET_APPLICATION_BY_LISTENERS_USER_ID(userId.toString()),
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; 
  } catch (error: any) {
    console.error("Error fetching listener application:", error);

    if (error.response) {
      console.error("Error fetching listener application:", error.response.data?.message || error.message);
    }
  }
};
