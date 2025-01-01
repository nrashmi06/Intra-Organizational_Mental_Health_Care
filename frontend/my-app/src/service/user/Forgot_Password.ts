import axios from "axios";
import { API_ENDPOINTS } from "@/mapper/userMapper"; // Import the userMapper
import axiosInstance from "@/utils/axios";
interface ForgotPasswordResponse {
  message: string;
}

const forgotPassword = async (email: string) => {
  try {
    const response = await axiosInstance.post<ForgotPasswordResponse>(
      API_ENDPOINTS.FORGOT_PASSWORD,
      { email }
    );
    // Assuming the response structure matches the example provided
    return response.data.message;
  } catch (error: any) {
    if (axios.isAxiosError(error)) {
      console.error("API error:", error.response?.data || error.message);
    } else {
      console.error("Unexpected error:", error);
    }
  }
};

export default forgotPassword;
