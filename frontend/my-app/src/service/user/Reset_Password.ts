import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/mapper/userMapper";

interface ResetPasswordParams {
  token: string;
  newPassword: string;
}

interface ResetPasswordResponse {
  message: string;
}

const resetPassword = async ({ token, newPassword }: ResetPasswordParams): Promise<string | void> => {
  try {
    const response = await axiosInstance.post<ResetPasswordResponse>(API_ENDPOINTS.RESET_PASSWORD, {
      token,
      newPassword,
    });

    return response.data.message;
  } catch (error: any) {
    const errorMessage =
      error.response?.data?.message || "An error occurred while resetting the password.";
    console.error("Error resetting password:", errorMessage);
  }
};

export default resetPassword;