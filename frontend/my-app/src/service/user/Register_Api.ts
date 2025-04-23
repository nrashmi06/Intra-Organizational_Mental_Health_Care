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
      console.error("Unexpected error:", error);

  }
};