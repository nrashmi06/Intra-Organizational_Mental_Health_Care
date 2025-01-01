import axiosInstance from "@/utils/axios"; // Import the Axios instance
import { SESSION_API_ENDPOINTS } from "@/mapper/sessionMapper";
import { isAxiosError } from "axios"; // Import isAxiosError from axios

export const getAverageSessionDetails = async (token: string) => {
  try {
    const response = await axiosInstance.get(
      SESSION_API_ENDPOINTS.AVG_SESSION_DURATION,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Add token dynamically
        },
      }
    );
    console.log("Average session summary:", response);
    return response.data; // Axios response contains 'data' field directly
  } catch (error) {
    if (isAxiosError(error)) {
      console.error(
        "Error fetching session summary:",
        (error.response?.data as string) || error.message
      );
    } else {
      console.error(
        "Error fetching session summary:",
        (error as Error).message
      );
    }
  }
};
