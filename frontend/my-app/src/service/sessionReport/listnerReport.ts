import axios from 'axios';

const API_BASE_URL = "http://localhost:8080/mental-health/api/v1/session-report";

export const submitFeedback = async (
  sessionId: number,
  rating: number,
  comments: string,
  accessToken: string
) => {
  try {
    const response = await axios.post(
      `${API_BASE_URL}`,
      {
        sessionId,
        rating,
        comments,
      },
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Error submitting feedback:", error);
    throw error;
  }
};
