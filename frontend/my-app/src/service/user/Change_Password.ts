import axios from "axios";
import { API_ENDPOINTS } from "@/mapper/userMapper"; // Import the userMapper

interface ChangePasswordParams {
  userId: string;
  oldPassword: string;
  newPassword: string;
  token: string;
}

interface ChangePasswordResponse {
  message: string;
}

const changePassword = async ({
  userId,
  oldPassword,
  newPassword,
  token,
}: ChangePasswordParams): Promise<string> => {
  try {
    const response = await axios.put<ChangePasswordResponse>(
      API_ENDPOINTS.CHANGE_PASSWORD(userId),
      {
        oldPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    // Assuming the response structure matches the example provided
    return response.data.message;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("API error:", error.response?.data || error.message);
      throw new Error(
        error.response?.data?.message || "Failed to change password"
      );
    } else {
      console.error("Unexpected error:", error);
      throw new Error("An unexpected error occurred");
    }
  }
};

export default changePassword;