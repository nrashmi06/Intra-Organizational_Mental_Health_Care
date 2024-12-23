// src/service/session/replyNotification.ts

import axios from "axios";
import { SESSION_API_ENDPOINTS } from "@/mapper/sessionMapper";

export const replyNotification = async (
  userId: string,
  action: "accept" | "reject",
  token: string
) => {
  try {
    const url = `${SESSION_API_ENDPOINTS.UPDATE_SESSION_STATUS(userId)}?action=${action}` ; // Use mapped endpoint
    const response = await axios.post(
      url,
      {},
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error(`Error during ${action} action for user ${userId}:`, error);
    throw error;
  }
};
