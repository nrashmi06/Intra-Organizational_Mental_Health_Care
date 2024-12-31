import { REPORT_API_ENDPOINTS } from "@/mapper/reportMapper";

export const getSessionReport = async (sessionId: string, token: string, signal?: AbortSignal) => {
  try {
    const response = await fetch(REPORT_API_ENDPOINTS.GET_REPORT_BY_SESSION_ID(sessionId), {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      signal
    });
    if(response.status === 404) {
      return response;
    }
    return response.json();
  } catch (error) {
    console.error("Error fetching session report:", error);
    throw error;
  }
};
