import { SESSION_API_ENDPOINTS } from "@/mapper/sessionMapper";

import axios from "axios";

export const getSessionsByStatus = async (
  accessToken: string,
  status: string
) => {
  try {
    const url = `${SESSION_API_ENDPOINTS.GET_SESSIONS_BY_STATUS}?status=${status}`;
    const response = await axios.get(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("completed response:", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching sessions by status:", error);
  }
};
