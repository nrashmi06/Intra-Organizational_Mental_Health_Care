import axios from "axios";
import { APPOINTMENT_API_ENDPOINTS } from "@/mapper/appointmentMapper";

export const getAdminUpcomingAppointmentsForAdmin = async (token: string) => {
  const response = await axios.get(`${APPOINTMENT_API_ENDPOINTS.GET_CURRENT_ADMIN_UPCOMING_APPOINTMENTS}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
  return response.data;
};