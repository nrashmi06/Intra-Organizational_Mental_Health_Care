import axiosInstance from "@/utils/axios"; // Import the Axios instance
import { REPORT_API_ENDPOINTS } from "@/mapper/reportMapper";
import { isAxiosError } from "axios"; // Import isAxiosError from axios

export const getSeverityAnalysis = async (token: string) => {
  try {
    const response = await axiosInstance.get(REPORT_API_ENDPOINTS.GET_REPORT_SUMMARY, {
      headers: {
        Authorization: `Bearer ${token}`, // Add token dynamically
      },
    });
    console.log("Session feedback summary:", response.data);
  } catch (error: unknown) {
    if (isAxiosError(error)) {
      console.error("Error fetching session feedback summary:", error.response?.data || error.message);
    } else {
      console.error("Error fetching session feedback summary:", error);
    }
    throw error; // Rethrow the error for further handling
  }
};
