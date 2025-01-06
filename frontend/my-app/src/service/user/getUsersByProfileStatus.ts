import { API_ENDPOINTS } from "@/mapper/userMapper";
import axiosInstance from "@/utils/axios";
import axios from "axios";

export const getUsersByProfileStatus = async ({
  page = 0,
  size = 1,
  status = "active",
  search,
  token,
}: {
  page?: number;
  size?: number;
  status?: string;
  search?: string;
  token: string;
}) => {
  try {
    const response = await axiosInstance.get(
      API_ENDPOINTS.GET_ALL_USERS_BY_PROFILE_STATUS,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          size,
          status,
          ...(search ? { search } : {}), 
        },
      }
    );
    
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        "Error fetching users by profile status:",
        error.response?.data
      );
    } else {
      console.error("Error fetching users by profile status:", error);
    }
  }
};