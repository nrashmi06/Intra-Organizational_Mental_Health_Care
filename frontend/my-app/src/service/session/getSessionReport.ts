// src/service/report/getSessionReport.ts
import axiosInstance from "@/utils/axios"; // Import the Axios instance
import { REPORT_API_ENDPOINTS } from "@/mapper/reportMapper"; // Import the report mapper

export const getSessionReport = async (
  sessionId: string,
  token: string,
  signal?: AbortSignal
) => {
  try {
    const url = REPORT_API_ENDPOINTS.GET_REPORT_BY_SESSION_ID(sessionId); // Use the mapped URL

    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      signal, // Include signal for request cancellation
    });
    if (response.status === 404) {
      return response;
    }
    return response.data; // Return the response data
  } catch (error) {
    console.error("Error fetching session report:", error);
  }
};
