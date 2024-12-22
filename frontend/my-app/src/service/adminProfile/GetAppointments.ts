import axios from "axios";

const API_BASE_URL =
  "http://localhost:8080/mental-health/api/v1/appointments/admin";

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
    let url = API_BASE_URL;

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
