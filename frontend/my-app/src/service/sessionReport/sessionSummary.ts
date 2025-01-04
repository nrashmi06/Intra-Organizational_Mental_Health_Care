import { FEEDBACK_API_ENDPOINTS } from "@/mapper/feedbackMapper";
import axiosInstance from "@/utils/axios";

export const getSessionFeedbackSummary = async (token: string) => {
  try {
    const response = await axiosInstance.get(
      FEEDBACK_API_ENDPOINTS.GET_SUMMARY_FEEDBACK,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error(
      "Error fetching session feedback summary:",
      error.message || error
    );
  }
};
