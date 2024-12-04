export const getAdminByUserID = async (userId: number, token: string) => {
  try {
    const response = await fetch(
      `http://localhost:8080/mental-health/api/v1/admins/profile?userId=${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("Response: ", response);

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    throw error;
  }
};
