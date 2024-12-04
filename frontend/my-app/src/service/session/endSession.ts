import axios from "axios";

export const endSession = async (sessionId: number, accessToken: string) => {
  const url = `http://localhost:8080/mental-health/api/v1/sessions/end/${sessionId}`;

  try {
    const response = await axios.post(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error ending session:", error);
    throw error;
  }
};
