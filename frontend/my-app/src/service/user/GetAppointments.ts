import axios from "axios";
import {APPOINTMENT_API_ENDPOINTS} from '@/mapper/appointmentMapper';

export const getAppointments = async (token: string, userId: string) => {
  try {
    const url = `${APPOINTMENT_API_ENDPOINTS.GET_APPOINTMENTS_BY_USER}/${userId}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Appointments fetched successfully:", response);
    return response;
  } catch (error: any) {
    console.error("Error fetching appointments:", error);
  }
};
