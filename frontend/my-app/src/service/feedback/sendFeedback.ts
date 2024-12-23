// api/submitFeedback.ts
import { FEEDBACK_API_ENDPOINTS } from "@/mapper/feedbackMapper";
const submitFeedback = async (
    auth: string,
    sessionId: string,
    rating: number,
    comment: string
  ) => {
    try {
      const response = await fetch(FEEDBACK_API_ENDPOINTS.CREATE_FEEDBACK, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${auth}`, // Make sure auth token is correct
        },
        body: JSON.stringify({
          sessionId: sessionId,
          rating: rating,
          comments: comment,
        }),
      });
  
      // Check if the response status is not OK (outside the range of 200-299)
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to submit feedback: ${errorText}`);
      }
  
      return await response.json();
    } catch (error) {
      console.error("Error during feedback submission:", error);
      throw error; // Rethrow the error after logging it
    }
  };
  
  export default submitFeedback;
  