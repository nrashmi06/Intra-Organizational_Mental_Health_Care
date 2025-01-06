import axiosInstance from "@/utils/axios";
import { FEEDBACK_API_ENDPOINTS } from "@/mapper/feedbackMapper";

const submitFeedback = async (
  auth: string,
  sessionId: string,
  rating: number,
  comment: string
) => {
  try {
    const response = await axiosInstance.post(
      FEEDBACK_API_ENDPOINTS.CREATE_FEEDBACK,
      {
        sessionId,
        rating,
        comments: comment,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth}`, 
        },
      }
    );

    return response.data; 
  } catch (error: any) {
    console.error("Error during feedback submission:", error);
    }
};

export default submitFeedback;
