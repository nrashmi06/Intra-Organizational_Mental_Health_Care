// src/service/user/getUserDetails.ts

export const getUserDetails = async (userId: string, token: string) => {
  try {
    const response = await fetch(
      `http://localhost:8080/mental-health/api/v1/users/${userId}`,
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
