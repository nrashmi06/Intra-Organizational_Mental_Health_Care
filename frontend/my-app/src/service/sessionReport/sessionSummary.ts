import { FEEDBACK_API_ENDPOINTS } from "@/mapper/feedbackMapper";
import axiosInstance from "@/utils/axios"; // Import the axios instance with global rate-limit handling

export const getSessionFeedbackSummary = async (token: string) => {
  try {
    const response = await axiosInstance.get(FEEDBACK_API_ENDPOINTS.GET_SUMMARY_FEEDBACK, {
      headers: {
        Authorization: `Bearer ${token}`, // Attach token to Authorization header
      },
    });

    console.log("Listener details:", response.data);
    return response.data; // Return the data from the response
  } catch (error) {
    const err = error as any;
    console.error("Error fetching session feedback summary:", err.message || err);
    throw new Error(`Failed to fetch session feedback summary: ${err.message || err}`);
  }
};
