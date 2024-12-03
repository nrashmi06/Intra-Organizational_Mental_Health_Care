export const getSessionFeedbackSummary = async (token: string) => {
  try {
    const response = await fetch(
      "http://localhost:8080/mental-health/api/v1/session-feedback/summary",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Session feedback summary:", response);
    return response;
  } catch (error) {
    console.error("Error fetching session feedback summary:", error);
    throw error;
  }
};
