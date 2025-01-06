// src/service/admin/fetchAdmins.ts
import axiosInstance from "@/utils/axios";
import { ADMIN_PROFILE_API_ENDPOINTS } from "@/mapper/adminProfileMapper";

export async function fetchAdmins(accessToken: string) {
  try {
    const response = await axiosInstance.get(
      ADMIN_PROFILE_API_ENDPOINTS.GET_ALL_ADMIN_PROFILE,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      }
    );

    return response.data; 
  } catch (error : any) {
    console.error("Error fetching admins:", error);

  }
}
