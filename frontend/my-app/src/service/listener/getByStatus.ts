//fetch applications of one kind
import axios from "axios";

export const GetByApproval = async (
  token: string,
  status: "PENDING" | "APPROVED" | "REJECTED"
) => {
  try {
    const response = await axios.get(
      `http://localhost:8080/mental-health/api/v1/listener-applications/status?status=${status}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.error("Error fetching listeners by approval status:", error);
  }
};
