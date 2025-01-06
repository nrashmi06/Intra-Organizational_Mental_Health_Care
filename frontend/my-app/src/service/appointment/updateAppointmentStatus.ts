import { APPOINTMENT_API_ENDPOINTS } from "@/mapper/appointmentMapper";
import axiosInstance from "@/utils/axios";

const updateAppointmentStatus = async (token: string, appointmentId: string, status: string, cancellationReason?: string) => {
  try {
    const payload: any = { status };

    if (status === "CANCELLED" && cancellationReason) {
      payload.cancellationReason = cancellationReason;
    }

    const response = await axiosInstance.put(
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
  }
}

export default updateAppointmentStatus;
