import axios from "axios";
import { API_ENDPOINTS } from "@/mapper/userMapper"; 
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
    return response.data.message;
  } catch (error: any) {
      console.error("Unexpected error:", error);
  }
};

export default forgotPassword;