import axios from "axios";
import { APPOINTMENT_API_ENDPOINTS } from "@/mapper/appointmentMapper";

export const getAppointmentByAdmin = async (token: string) => {
  try {
    const response = await axios.get(
      APPOINTMENT_API_ENDPOINTS.GET_APPOINTMENTS_BY_ADMIN,
      {
        headers: {            
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response;
  } catch (error: any) {
    console.error("Error rejecting appointment:", error.response?.data || error.message || error);
    throw error;
  }
}