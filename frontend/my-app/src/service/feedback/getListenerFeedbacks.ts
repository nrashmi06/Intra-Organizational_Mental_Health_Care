// fetch all the feedbacks of a listener using the listener userid

import axios from "axios";
import { FEEDBACK_API_ENDPOINTS } from "@/mapper/feedbackMapper";
import { ListenerFeedback } from "@/lib/types";

export const getListenerFeedbacks = async (
  userId: string,
  accessToken: string
) => {
  try {
    const response = await axios.get<ListenerFeedback[]>(
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
    console.log(response.data);
    return response.data;
  } catch (error) {
    console.error("Error fetching listener feedbacks:", error);
    throw error;
  }
};
