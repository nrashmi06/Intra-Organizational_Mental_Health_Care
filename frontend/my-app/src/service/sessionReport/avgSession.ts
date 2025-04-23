import axiosInstance from "@/utils/axios"; // Import the Axios instance
import { SESSION_API_ENDPOINTS } from "@/mapper/sessionMapper";

export const getAverageSessionDetails = async (token: string) : Promise<any>=> {
  try {
    const response = await axiosInstance.get(
      SESSION_API_ENDPOINTS.AVG_SESSION_DURATION,
      {
        headers: {
          Authorization: `Bearer ${token}`, 
        },
      }
    );
    return response.data; 
  } catch (error) {
      console.error(
        "Error fetching session summary:",
        (error as Error).message
      );
    } }