import axios from "axios";
import { LISTENER_APPLICATION_API_ENDPOINTS } from "@/mapper/listnerMapper"; // Import the URL mapper

export const GetByApproval = async (
  token: string,
  status: "PENDING" | "APPROVED" | "REJECTED"
) => {
  try {
    // Use the mapped endpoint for fetching applications by approval status
    const response = await axios.get(
      `${LISTENER_APPLICATION_API_ENDPOINTS.GET_APPLICATION_BY_APPROVAL_STATUS}?status=${status}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    console.log("Response from server: isssssssssssssssss:", response);
    return response;
  } catch (error) {
    console.error("Error fetching listeners by approval status:", error);
  }
};
