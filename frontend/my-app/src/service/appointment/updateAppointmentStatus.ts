import axios from "axios";
import { APPOINTMENT_API_ENDPOINTS } from "@/mapper/appointmentMapper";

const updateAppointmentStatus = async (token: string, appointmentId: string, status: string, cancellationReason?: string) => {
  try {
    // Conditionally include cancellationReason only if the status is "canceled"
    const payload: any = { status };

    if (status === "CANCELLED" && cancellationReason) {
      payload.cancellationReason = cancellationReason;
    }

    const response = await axios.put(
      `${APPOINTMENT_API_ENDPOINTS.UPDATE_APPOINTMENT_STATUS(appointmentId)}`,
      payload,
      {    
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error: any) {
    console.error("Error updating appointment status:", error.response?.data || error.message || error);
    throw error;
  }
}

export default updateAppointmentStatus;
