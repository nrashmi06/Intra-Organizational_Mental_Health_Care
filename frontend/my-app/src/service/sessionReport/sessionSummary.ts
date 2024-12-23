import { FEEDBACK_API_ENDPOINTS } from "@/mapper/feedbackMapper";

export const getSessionFeedbackSummary = async (token: string) => {
  try {
    const response = await fetch(FEEDBACK_API_ENDPOINTS.GET_SUMMARY_FEEDBACK, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    const data = await response.json();
    console.log("Listener details:", data);
    return data;
  } catch (error) {
    console.error("Error fetching session feedback summary:", error);
    throw error;
  }
};
