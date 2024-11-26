import axios from "axios";

// Define the interface for the request parameters
interface ResetPasswordParams {
  token: string;
  newPassword: string;
}

const BASE_URL = "http://localhost:8080/mental-health/api/v1";
const resetPassword = async ({ token, newPassword }: ResetPasswordParams): Promise<string> => {
  try {
    const response = await axios.post(`${BASE_URL}/users/reset-password`, {
      token,
      newPassword,
    });

    // Assuming the response contains a "message" field
    return response.data.message;
  } catch (error: any) {
    // Extract meaningful error message
    const errorMessage =
      error.response?.data?.message || "An error occurred while resetting the password.";
    throw new Error(errorMessage);
  }
};

export default resetPassword;
