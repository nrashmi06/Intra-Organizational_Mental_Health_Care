import axios from "axios";

const API_BASE_URL = "http://localhost:8080/mental-health/api/v1/appointments/user";

export const getAppointmentsByUserId = async (token: string, userId: number) => {
  try {
    const url = `${API_BASE_URL}?userId=${userId}`;

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error: any) {
    console.error("Error fetching appointments:", error);
    throw error;
  }
};