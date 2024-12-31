import axiosInstance from "@/utils/axios";
import { SESSION_API_ENDPOINTS } from "@/mapper/sessionMapper";

export const replyNotification = async (
  userId: string,
  action: "accept" | "reject",
  token: string
) => {
  try {
    const url = `${SESSION_API_ENDPOINTS.UPDATE_SESSION_STATUS(
      userId
    )}?action=${action}`;
    const response = await axiosInstance.post(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error) {
    console.info(`Error during ${action} action for user ${userId}:`, error);
  }
};
