import { APPOINTMENT_API_ENDPOINTS } from "@/mapper/appointmentMapper"; 
import axiosInstance from "@/utils/axios";

export const rejectAppointment = async (token: string, appointmentId: string) => {
  try {
    const response = await axiosInstance.post(
      APPOINTMENT_API_ENDPOINTS.CANCEL_APPOINTMENT(appointmentId),
      {

        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    console.error("Error rejecting appointment:", error.response?.data || error.message || error);
    throw error;
  }
}