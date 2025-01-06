import { EMERGENCY_API_ENDPOINTS } from "@/mapper/emergencyMapper";
import axiosInstance from "@/utils/axios";

export const deleteEmergencyHelpline = async (helplineId: string, token: string): Promise<void> => {
  const apiUrl = `${EMERGENCY_API_ENDPOINTS.DELETE_EMERGENCY(helplineId)}`;
  try {
    await axiosInstance.delete(apiUrl, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  } catch (error) {
    console.error("Failed to delete helpline:", error);
  }
};
