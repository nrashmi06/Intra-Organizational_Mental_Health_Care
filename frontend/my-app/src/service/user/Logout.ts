import axios from "axios";
import { API_ENDPOINTS } from "@/mapper/userMapper";
// Function to log out the user
export const logout = async (accessToken: string) => {
  try {
    // Make a POST request to the logout endpoint
    const response = await axios.post(
      `${API_ENDPOINTS.LOGOUT}`,
      {},
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        withCredentials: true,
      }
    );

    return response.data; // Return the response data
  } catch (error) {
    console.error("Error logging out the user:", error);
    throw error; // Rethrow to handle in the calling function
  }
};