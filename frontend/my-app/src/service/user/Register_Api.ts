import axios from "axios";
import { API_ENDPOINTS } from "@/mapper/userMapper";

// Define the structure of the payload when registering a user
export interface RegisterUserPayload {
  email: string;
  password: string;
  anonymousName: string;
}

// Define a custom error response interface (if applicable)
interface ErrorResponse {
  message: string;
  status?: number; // Optional, in case the backend doesn't return status
}

// Service to register a user
export const registerUser = async (data: RegisterUserPayload) => {
  try {
    const response = await axios.post(API_ENDPOINTS.REGISTER, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // Return the successful response data
  } catch (error: unknown) {
    // Handle axios-specific errors
    if (axios.isAxiosError(error)) {
      console.error("API error while registering user:", error.response?.data || error.message);
      // Throw a meaningful error message for further handling
      throw error.response?.data as ErrorResponse || { message: "An unexpected API error occurred" };
    } else {
      console.error("Unexpected error:", error);
      throw { message: "An unexpected error occurred" };
    }
  }
};
