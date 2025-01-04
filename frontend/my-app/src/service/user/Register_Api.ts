import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/mapper/userMapper";
import axios from "axios";

export interface RegisterUserPayload {
  email: string;
  password: string;
  anonymousName: string;
}

export interface ApiError {
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
    console.log("RESPONSE", response);
    return response;
  } catch (error: unknown) {
    let errorToThrow: ApiError = {
      message: "An unexpected error occurred during registration",
    };

    if (axios.isAxiosError(error)) {
      errorToThrow = {
        message: error.response?.data?.message || error.message,
        status: error.response?.status
      };

      console.error("API error while registering user:", errorToThrow.message);
      
    } else {
      console.error("Unexpected error:", error);
    }

    throw errorToThrow;
  }
};