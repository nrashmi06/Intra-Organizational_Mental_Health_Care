// src/service/listener/getCertificate.ts

export const getApplicationByListenerUserId = async (
  userId: number,
  token: string
) => {
  try {
    const response = await fetch(
      `http://localhost:8080/mental-health/api/v1/listener-applications/listener/${userId}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching listener certificate:", error);
    throw error;
  }
};
