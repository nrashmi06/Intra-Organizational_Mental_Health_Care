import axiosInstance from "@/utils/axios";
import { SESSION_API_ENDPOINTS } from "@/mapper/sessionMapper";

export const initiateSession = async (
  listenerId: string,
  message: string,
  token: string
) => {
  try {
    const url = SESSION_API_ENDPOINTS.INITIATE_SESSION(listenerId); 
    const response = await axiosInstance.post(
      url,
      { message },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error : any) {
      console.error("Error initiating session:", error.response?.data);
  }
};
