import axiosInstance from "@/utils/axios";
import { REPORT_API_ENDPOINTS } from "@/mapper/reportMapper";

export const getSessionReport = async (
  sessionId: string,
  token: string,
  controller?: AbortController
) => {
  try {
    const url = REPORT_API_ENDPOINTS.GET_REPORT_BY_SESSION_ID(sessionId);

    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (controller?.signal.aborted) {
      console.warn("Request was aborted.");
      return;
    }

    return response.data;
  } catch (error: any) {
    if (controller?.signal.aborted) {
      console.warn("Fetch aborted by user.");
    } else {
      console.error("Error fetching session report:", error);
    }
  }
};
