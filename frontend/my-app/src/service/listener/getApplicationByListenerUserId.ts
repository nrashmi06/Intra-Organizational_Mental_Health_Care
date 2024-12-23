import { LISTENER_APPLICATION_API_ENDPOINTS } from "@/mapper/listnerMapper"; // Import the URL mapper

export const getApplicationByListenerUserId = async (
  userId: number,
  token: string
) => {
  try {
    // Use the mapped endpoint for fetching application by listener's user ID
    const response = await fetch(
      LISTENER_APPLICATION_API_ENDPOINTS.GET_APPLICATION_BY_LISTENERS_USER_ID(userId.toString()),
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
