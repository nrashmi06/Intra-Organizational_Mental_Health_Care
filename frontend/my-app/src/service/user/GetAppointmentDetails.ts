// src/service/user/getAppointmentsByUserId.ts

export const getAppointmentDetails = async (appointmentId: string, token: string) => {
  try {
    const response = await fetch(
      `http://localhost:8080/mental-health/api/v1/appointments/${appointmentId}`,
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
