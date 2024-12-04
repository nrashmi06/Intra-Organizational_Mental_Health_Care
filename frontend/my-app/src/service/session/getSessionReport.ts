// src/service/session/getSessionFeedback.ts

export const getSessionReport = async (sessionId: number, token: string) => {
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

    if (!response) {
      throw new Error(`Error: ${response}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching session feedback:", error);
    throw error;
  }
};
