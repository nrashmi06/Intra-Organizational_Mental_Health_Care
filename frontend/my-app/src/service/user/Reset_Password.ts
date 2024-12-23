import axios from "axios";
import { API_ENDPOINTS } from "@/mapper/userMapper";

// Define the interface for the request parameters
interface ResetPasswordParams {
  token: string;
  newPassword: string;
}

// Service to reset the password
const resetPassword = async ({ token, newPassword }: ResetPasswordParams): Promise<string> => {
  try {
    const response = await axios.post(API_ENDPOINTS.RESET_PASSWORD, {
      token,
      newPassword,
    });

    // Assuming the response contains a "message" field
    return response.data.message;
  } catch (error: any) {
    // Extract meaningful error message
    const errorMessage =
      error.response?.data?.message || "An error occurred while resetting the password.";
    console.error("Error resetting password:", errorMessage);
    throw new Error(errorMessage);
  }
};

export default resetPassword;
