import axios from "axios";
import {APPOINTMENT_API_ENDPOINTS} from '@/mapper/appointmentMapper';


interface GetAppointmentsParams {
  token: string;
  adminId?: string;
  userId?: string;
}

export const getAppointments = async ({
  token,
  adminId,
  userId,
}: GetAppointmentsParams) => {
  try {
    let url = APPOINTMENT_API_ENDPOINTS.GET_APPOINTMENTS_BY_ADMIN;

    if (adminId) {
      url += `?adminId=${adminId}`;
    } else if (userId) {
      url += `?userId=${userId}`;
    }

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    console.log("Appointments fetched successfully:", response);
    return response;
  } catch (error: any) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};
