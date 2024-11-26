import axios from "axios";

const API_BASE_URL = 'http://localhost:8080/mental-health/api/v1/users';


// Define the structure of the payload when registering a user
export interface RegisterUserPayload {
  email: string;
  password: string;
  anonymousName: string;
}

// Define a custom error response interface (if applicable)
interface ErrorResponse {
  message: string;
  status: number;
}

export const registerUser = async (data: RegisterUserPayload) => {
  try {
    const response = await axios.post(`${API_BASE_URL}/register`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    });
    return response.data; // Return the response data
  } catch (error: unknown) {
    // Handle and type the error more specifically
    console.error("Error registering user:", error);
    if (axios.isAxiosError(error)) {
      throw (error.response?.data as ErrorResponse) || "An unexpected error occurred";
    } else {
      throw "An unexpected error occurred";
    }
  }
};
