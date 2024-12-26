import axios from "axios";
import { APPOINTMENT_API_ENDPOINTS } from "@/mapper/appointmentMapper";

const updateAppointmentStatus = async ( token:string , appointmentId:string ,  status : string , cancellationReason : string) => {
    try {
        const response = await axios.put(
          `${APPOINTMENT_API_ENDPOINTS.UPDATE_APPOINTMENT_STATUS(appointmentId)}`,
          {
            cancellationReason : cancellationReason,
            status : status
          },
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

export default updateAppointmentStatus;