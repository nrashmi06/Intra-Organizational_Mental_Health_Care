// api/submitFeedback.ts
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
          Authorization: `Bearer ${auth}`, // Ensure the auth token is correct
        },
      }
    );

    return response.data; // Return the parsed response data
  } catch (error: any) {
    console.error("Error during feedback submission:", error);

    // Handle Axios-specific errors
    if (error.response) {
      throw new Error(
        `Failed to submit feedback: ${error.response.data?.message || error.response.statusText}`
      );
    } else if (error.request) {
      throw new Error("No response received from the server. Please try again.");
    } else {
      throw new Error(error.message || "An unexpected error occurred.");
    }
  }
};

export default submitFeedback;
