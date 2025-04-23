import axiosInstance from "@/utils/axios"; 
import { REPORT_API_ENDPOINTS } from "@/mapper/reportMapper";

export const getSeverityAnalysis = async (token: string) : Promise<any>=> {
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
      console.error("Error fetching session feedback summary:", error);
  }
};