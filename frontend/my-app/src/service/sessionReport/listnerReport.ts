import axiosInstance from "@/utils/axios";
import { REPORT_API_ENDPOINTS } from "@/mapper/reportMapper";

export const submitFeedback = async (
  sessionId: number,
  reportContent: string,
  severityLevel: number,
  accessToken: string
) => {
  try {
    const response = await axiosInstance.post(
      REPORT_API_ENDPOINTS.CREATE_REPORT,
      {
        sessionId,
        reportContent,
        severityLevel,
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
  }
};
