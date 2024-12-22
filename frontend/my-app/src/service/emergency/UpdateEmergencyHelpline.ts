import axios from "axios";
import { EMERGENCY_API_ENDPOINTS } from "@/mapper/emergencyMapper";

export const updateEmergencyHelpline = async (
  helplineId: string,
  token: string,
  body: {
    name: string;
    phoneNumber: string;
    countryCode: string;
    emergencyType: string;
    priority: number;
  }
) => {
  try {
    const response = await axios.put(
      `${EMERGENCY_API_ENDPOINTS.DELETE_EMERGENCY(helplineId)}`,
      body,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error("Failed to update the helpline:", error);
    throw error;
  }
};
