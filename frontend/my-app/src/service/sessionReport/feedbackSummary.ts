import axiosInstance from "@/utils/axios"; 
import { REPORT_API_ENDPOINTS } from "@/mapper/reportMapper";
import { isAxiosError } from "axios";

export const getSeverityAnalysis = async (token: string) => {
  try {
    const response = await axiosInstance.get(
      REPORT_API_ENDPOINTS.GET_REPORT_SUMMARY,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );

    return response.data; 
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error(
        "Error fetching session feedback summary:",
        error.response?.data || error.message
      );
    } else {
      console.error("Error fetching session feedback summary:", error);
    }
  }
};
