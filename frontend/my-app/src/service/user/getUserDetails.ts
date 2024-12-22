import { API_ENDPOINTS } from "@/mapper/userMapper"; // Adjust path as per your project structure

export const getUserDetails = async (userId: number, token: string) => {
  try {
    // Use the dynamic endpoint from envMapper.js
    const url = API_ENDPOINTS.GET_USER_BY_ID(userId.toString());

    const response = await fetch(url, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      // Handle specific HTTP errors
      if (response.status === 404) {
        throw new Error("User not found.");
      } else if (response.status === 401) {
        throw new Error("Unauthorized access. Please log in again.");
      } else {
        throw new Error(`Error: ${response.statusText || "Unknown error occurred."}`);
      }
    }

    // Parse the JSON response
    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching user details:", error);
    // Re-throw error with a meaningful message
    throw new Error(error instanceof Error ? error.message : "Failed to fetch user details.");
  }
};
