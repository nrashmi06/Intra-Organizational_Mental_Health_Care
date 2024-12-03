//fetch the application of the user with or without the application ID.

import axios from "axios";

const API_BASE_URL =
  "http://localhost:8080/mental-health/api/v1/listener-applications/application";

export const fetchApplication = async (
  accessToken: string,
  applicationId?: number
) => {
  try {
    const url = applicationId
      ? `${API_BASE_URL}?applicationId=${applicationId}`
      : API_BASE_URL;
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
