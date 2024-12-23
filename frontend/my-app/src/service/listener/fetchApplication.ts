import axios from "axios";
import { LISTENER_APPLICATION_API_ENDPOINTS } from "@/mapper/listnerMapper"; // Import the URL mapper

export const fetchApplication = async (
  accessToken: string,
  applicationId?: string
) => {
  try {
    // Use the mapped endpoint for fetching application by ID or all applications
    const url = applicationId
      ? `${LISTENER_APPLICATION_API_ENDPOINTS.GET_APPLICATION_BY_ID}?applicationId=${applicationId}` // URL for fetching by application ID
      : LISTENER_APPLICATION_API_ENDPOINTS.GET_ALL_APPLICATIONS; // URL for fetching all applications

    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error) && error.response?.status === 404) {
      return null;
    }
    console.error("Error fetching application:", error);
    throw error;
  }
};
