import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/mapper/userMapper";
import axios from "axios";

export interface RegisterUserPayload {
  email: string;
  password: string;
  anonymousName: string;
}
interface ErrorResponse {
  message: string;
  status?: number; 
}

export const registerUser = async (data: RegisterUserPayload) => {
  try {
    const response = await axiosInstance.post(API_ENDPOINTS.REGISTER, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; 
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.error("API error while registering user:", error.response?.data || error.message);
      throw error.response?.data as ErrorResponse || { message: "An unexpected API error occurred" };
    } else {
      console.error("Unexpected error:", error);
      throw { message: "An unexpected error occurred" };
    }
  }
};
