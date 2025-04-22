import axiosInstance from '@/utils/axios'
import { SESSION_API_ENDPOINTS } from "@/mapper/sessionMapper"; 
export const getSessionListByRole = async (
  id: string,
  role: string,
  token: string
) => {
  try {
    const url = `${SESSION_API_ENDPOINTS.GET_SESSIONS_BY_USER_ID_OR_LISTENER_ID(
      id
    )}?role=${role}`; 
    const response = await axiosInstance.get(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error("Error fetching listener sessions:", error);
  }
};
