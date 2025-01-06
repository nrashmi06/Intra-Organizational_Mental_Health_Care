import { FEEDBACK_API_ENDPOINTS } from "@/mapper/feedbackMapper";
import { ListenerFeedback } from "@/lib/types";
import axiosInstance from "@/utils/axios";

export const getListenerFeedbacks = async (
  userId: string,
  accessToken: string
) => {
  try {
    const response = await axiosInstance.get<ListenerFeedback[]>(
      `${FEEDBACK_API_ENDPOINTS.GET_ALL_LISTNER_FEEDBCK(userId)}`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
        params: {
          type: "userId",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error fetching listener feedbacks:", error);
  }
};
