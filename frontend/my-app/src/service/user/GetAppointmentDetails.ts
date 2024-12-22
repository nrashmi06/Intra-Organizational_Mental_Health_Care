// src/service/user/getAppointmentsByUserId.ts
import {APPOINTMENT_API_ENDPOINTS} from '@/mapper/appointmentMapper';
export const getAppointmentDetails = async (appointmentId: number, token: string) => {
  try {
    const response = await fetch(
      APPOINTMENT_API_ENDPOINTS.GET_APPOINTMENT_BY_ID(appointmentId.toString()),
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    throw error;
  }
};
