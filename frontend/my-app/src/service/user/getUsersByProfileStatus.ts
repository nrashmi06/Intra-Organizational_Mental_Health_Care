import { API_ENDPOINTS } from "@/mapper/userMapper";
import axiosInstance from "@/utils/axios";
import { User as UserType } from "@/lib/types";

interface GetUsersByProfileStatusResponse {
  content: UserType[];
  page: {
    totalElements: number;
    totalPages: number;
  };
}

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
}): Promise<GetUsersByProfileStatusResponse> => {
  try {
    const response = await axiosInstance.get<GetUsersByProfileStatusResponse>(
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
    console.error("Error fetching users by profile status:", error);
    throw error;
  }
};