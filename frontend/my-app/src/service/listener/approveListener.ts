import axios from "axios";

const API_BASE_URL =
  "http://localhost:8080/mental-health/api/v1/listener-applications";

export const approveListener = async (
  applicationId: number,
  accessToken: string
) => {
  try {
    const url = `${API_BASE_URL}/${applicationId}/status`;
    const response = await axios.put(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error approving listener:", error.response?.data);
    } else {
      console.error("Error approving listener:", error);
    }
    throw error;
  }
};
