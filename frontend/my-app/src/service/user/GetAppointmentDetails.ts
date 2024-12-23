// src/service/user/getAppointmentsByUserId.ts
import { APPOINTMENT_API_ENDPOINTS } from '@/mapper/appointmentMapper';

export const getAppointmentDetails = async (appointmentId: string | null, token: string) => {
  if (!appointmentId) {
    console.error("Appointment ID is null or undefined.");
    throw new Error("Appointment ID cannot be null or undefined.");
  }

  try {
    const response = await fetch(
      APPOINTMENT_API_ENDPOINTS.GET_APPOINTMENT_BY_ID(appointmentId),
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
    console.error("Error fetching appointment details:", error);
    throw error;
  }
};
