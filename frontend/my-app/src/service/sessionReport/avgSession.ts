import { SESSION_API_ENDPOINTS } from "@/mapper/sessionMapper";

export const getAverageSessionDetails = async (token: string) => {
  try {
    const response = await fetch(SESSION_API_ENDPOINTS.AVG_SESSION_DURATION, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Average session summary:", response);
    return response.text();
  } catch (error) {
    console.error("Error fetching session feedback summary:", error);
    throw error;
  }
};
