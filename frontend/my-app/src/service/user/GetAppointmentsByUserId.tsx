// src/service/user/getAppointmentsByUserId.ts

export const getAppointmentsByUserId = async (userId: number, token: string) => {
  try {
    const response = await fetch(
      `http://localhost:8080/mental-health/api/v1/appointments/user?userId=${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response;
  } catch (error) {
    console.error("Error fetching user details:", error);
  }
};
