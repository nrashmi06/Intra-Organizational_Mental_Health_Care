// src/service/session/getSessionMessages.ts

export const getSessionMessages = async (sessionId: string, token: string) => {
  try {
    const response = await fetch(
      `http://localhost:8080/mental-health/api/v1/sessions/messages/${sessionId}`,
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
    console.error("Error fetching session messages:", error);
    throw error;
  }
};
