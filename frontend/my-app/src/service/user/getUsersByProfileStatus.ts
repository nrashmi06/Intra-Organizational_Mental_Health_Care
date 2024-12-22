import axios from "axios";
const API_BASE_URL = "http://localhost:8080/mental-health/api/v1/users";

export const getUsersByProfileStatus = async (
  token: string,
  status: string
) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/all`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        status: status,
      },
    });
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching users by profile status:",
        error.response?.data
      );
    } else {
      console.error("Error fetching users by profile status:", error);
    }
  }
};
