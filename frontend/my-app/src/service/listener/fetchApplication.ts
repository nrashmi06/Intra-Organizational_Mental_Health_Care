import axios from "axios";

const API_BASE_URL =
  "http://localhost:8080/mental-health/api/v1/listener-applications/application";

export const fetchApplication = async (accessToken: string) => {
  try {
    const response = await axios.get(API_BASE_URL, {
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
