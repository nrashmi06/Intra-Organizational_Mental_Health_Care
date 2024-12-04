import axios from "axios";

export const replyNotification = async (
  userId: string,
  action: "accept" | "reject",
  token: string
) => {
  try {
    const response = await axios.post(
      `http://localhost:8080/mental-health/api/v1/sessions/status/${userId}?action=${action}`,
      {}, 
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error during ${action} action for user ${userId}:`, error);
    throw error;
  }
};
