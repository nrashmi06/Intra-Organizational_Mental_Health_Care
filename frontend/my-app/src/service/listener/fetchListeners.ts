import axios from "axios";
import { LISTENER_APPLICATION_API_ENDPOINTS } from "@/mapper/listnerMapper"; // Import the URL mapper

export const fetchListeners = async (accessToken: string) => {
  try {
    // Use the mapped endpoint for fetching all listener applications
    const response = await axios.get(LISTENER_APPLICATION_API_ENDPOINTS.GET_ALL_APPLICATIONS, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    console.error("Error fetching listener applications:", error);
    throw error;
  }
};
