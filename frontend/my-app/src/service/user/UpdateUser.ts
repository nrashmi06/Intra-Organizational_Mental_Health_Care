import axiosInstance from "@/utils/axios"; // Import the Axios instance
import { API_ENDPOINTS } from "@/mapper/userMapper";

export interface UpdateUserParams {
  userId: string;
  token: string;
  anonymousName: string;
}

export interface UpdateUserResponse {
  success: boolean;
  message: string;
  data?: {
    anonymousName: string;
  };
}

const ERROR_MESSAGES = {
  UNAUTHORIZED: "Unauthorized access. Please log in again.",
  NOT_FOUND: "User not found. Unable to update user details.",
  CONFLICT: "Anonymous name already in use.",
  DEFAULT: "An unexpected error occurred while updating user details.",
  NETWORK: "Network error. Please check your connection and try again.",
} as const;

export const updateUser = async ({
  userId,
  token,
  anonymousName,
}: UpdateUserParams): Promise<UpdateUserResponse> => {
  try {
    await axiosInstance.put(
      API_ENDPOINTS.UPDATE_USER(userId),
      { anonymousName },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    // If successful, return success response
    return {
      success: true,
      message: "User updated successfully.",
      data: { anonymousName },
    };
  } catch (error: any) {
    console.error("Error updating user details:", error);

    // Axios-specific error handling
    if (error.response) {
      const errorMessages = {
        401: ERROR_MESSAGES.UNAUTHORIZED,
        404: ERROR_MESSAGES.NOT_FOUND,
        409: ERROR_MESSAGES.CONFLICT,
      };

      return {
        success: false,
        message:
          errorMessages[error.response.status as keyof typeof errorMessages] ||
          ERROR_MESSAGES.DEFAULT,
        data: { anonymousName: "" },
      };
    }

    return {
      success: false,
      message: ERROR_MESSAGES.NETWORK,
      data: { anonymousName: "" },
    };
  }
};
