import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/mapper/userMapper";
import axios from "axios";

export interface RegisterUserPayload {
  email: string;
  password: string;
  anonymousName: string;
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
      // Forward the exact error message from the API
      const errorMessage = error.response?.data?.message || error.message;
      console.error("API error while registering user:", errorMessage);
      throw { message: errorMessage };
    } else {
      console.error("Unexpected error:", error);
      throw { message: "An unexpected error occurred" };
    }
  }
};
