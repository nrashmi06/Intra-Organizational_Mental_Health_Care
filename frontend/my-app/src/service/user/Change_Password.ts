import axiosInstance from "@/utils/axios";
import { API_ENDPOINTS } from "@/mapper/userMapper";
import axios from "axios";

interface ChangePasswordParams {
  userId: string;
  oldPassword: string;
  newPassword: string;
  token: string;
}

interface ChangePasswordResponse {
  message: string;
}

const changePassword = async ({
  userId,
  oldPassword,
  newPassword,
  token,
}: ChangePasswordParams) => {
  try {
    const response = await axiosInstance.put<ChangePasswordResponse>(
      API_ENDPOINTS.CHANGE_PASSWORD(userId),
      {
        oldPassword,
        newPassword,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data.message;
  } catch (error: any) {
      console.error("Unexpected error:", error);
    }
};

export default changePassword;