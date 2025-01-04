import axiosInstance from "@/utils/axios";
import { REPORT_API_ENDPOINTS } from "@/mapper/reportMapper"; 

export const getSessionReport = async (
  sessionId: string,
  token: string,
  signal?: AbortSignal
) => {
  try {
    const url = REPORT_API_ENDPOINTS.GET_REPORT_BY_SESSION_ID(sessionId); 

    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      signal, 
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching session report:", error);
  }
};
