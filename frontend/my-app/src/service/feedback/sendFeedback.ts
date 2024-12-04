// api/submitFeedback.ts

const submitFeedback = async (
    auth: string,
    sessionId: string,
    rating: number,
    comment: string
  ) => {
    try {
      const response = await fetch("http://localhost:8080/mental-health/api/v1/session-feedback", {
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
  