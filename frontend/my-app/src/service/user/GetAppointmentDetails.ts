import axiosInstance from "@/utils/axios"; // Import your Axios instance
import { APPOINTMENT_API_ENDPOINTS } from '@/mapper/appointmentMapper';

export const getAppointmentDetails = async (appointmentId: string | null, token: string) => {
  if (!appointmentId) {
    console.error("Appointment ID is null or undefined.");
    throw new Error("Appointment ID cannot be null or undefined.");
  }

  try {
    // Send GET request using axiosInstance to fetch appointment details
    const response = await axiosInstance.get(
      APPOINTMENT_API_ENDPOINTS.GET_APPOINTMENT_BY_ID(appointmentId), 
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; // Return the response data
  } catch (error : any) {
    // Error handling
    if (error.response) {
      // If error has a response (e.g., 400, 404, etc.)
      console.error("Error fetching appointment details:", error.response.data?.message || error.message);
    } else {
      // Network or unknown error
      console.error("Error fetching appointment details:", error.message || error);
    }
    throw error; // Re-throw the error for further handling if needed
  }
};
