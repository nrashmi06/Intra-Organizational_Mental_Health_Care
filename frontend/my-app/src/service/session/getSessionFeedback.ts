// src/service/session/getSessionFeedback.ts

export const getSessionFeedback = async (sessionId: string, token: string) => {
  try {
    const response = await fetch(
      `http://localhost:8080/mental-health/api/v1/session-feedback/session/${sessionId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    console.log(data);
    return data;
  } catch (error) {
    console.error("Error fetching session feedback:", error);
    throw error;
  }
};
