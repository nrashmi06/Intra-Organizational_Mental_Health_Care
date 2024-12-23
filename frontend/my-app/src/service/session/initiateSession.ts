// src/service/session/initiateSession.ts

import axios from "axios";
import { SESSION_API_ENDPOINTS } from "@/mapper/sessionMapper";

export const initiateSession = async (
  listenerId: string,
  message: string,
  token: string
) => {
  try {
    const url = SESSION_API_ENDPOINTS.INITIATE_SESSION(listenerId); // Use mapped endpoint
    const response = await axios.post(
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
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error initiating session:", error.response?.data);
    } else {
      console.error("Error initiating session:", error);
    }
    throw error;
  }
};
