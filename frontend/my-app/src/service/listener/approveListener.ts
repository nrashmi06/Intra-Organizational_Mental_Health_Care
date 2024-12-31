import axios from "axios";
import { LISTENER_APPLICATION_API_ENDPOINTS } from "@/mapper/listnerMapper"; // Import the mapper
import axiosInstance from "@/utils/axios";

export const approveListener = async (
  applicationId: string,
  accessToken: string,
  status: "APPROVED" | "REJECTED" | "PENDING"
) => {
  try {
    const url = LISTENER_APPLICATION_API_ENDPOINTS.UPDATE_APPLICATION_STATUS(applicationId.toString()); // Use the mapped endpoint
    const response = await axiosInstance.put(
      `${url}?status=${status}`, // Append status query parameter
      {}, // You can pass any body content here if needed, empty object for now
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      }
    );

    return response;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error approving listener:", error.response?.data || error.message);
    } else {
      console.error("Error approving listener:", error);
    }
  }
};
