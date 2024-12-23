// services/emergency/DeleteEmergencyHelpline.ts
import axios from "axios";
import { EMERGENCY_API_ENDPOINTS } from "@/mapper/emergencyMapper";

export const deleteEmergencyHelpline = async (helplineId: string, token: string): Promise<void> => {
  const apiUrl = `${EMERGENCY_API_ENDPOINTS.DELETE_EMERGENCY(helplineId)}`;
  try {
    await axios.delete(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Failed to delete helpline:", error);
    throw error;
  }
};
