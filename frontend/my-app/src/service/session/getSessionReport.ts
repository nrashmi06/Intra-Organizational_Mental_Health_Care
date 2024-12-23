// src/service/session/getSessionFeedback.ts

export const getSessionReport = async (sessionId: string, token: string) => {
  try {
    const response = await fetch(
      `http://localhost:8080/mental-health/api/v1/session-report/session/${sessionId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.json();
  } catch (error) {
    console.error("Error fetching session feedback:", error);
    throw error;
  }
};
