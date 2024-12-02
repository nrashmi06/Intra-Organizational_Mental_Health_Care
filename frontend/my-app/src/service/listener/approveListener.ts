import axios from "axios";

const API_BASE_URL =
  "http://localhost:8080/mental-health/api/v1/listener-applications";

export const approveListener = async (
  applicationId: number,
  accessToken: string,
  status: "APPROVED" | "REJECTED" | "PENDING"
) => {
  try {
    const url = `${API_BASE_URL}/${applicationId}/update-status?status=${status}`;
    const response = await axios.put(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error approving listener:");
    } else {
      console.error("Error approving listener:");
    }
  }
};
