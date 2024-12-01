// services/emergency/DeleteEmergencyHelpline.ts
import axios from "axios";

export const deleteEmergencyHelpline = async (helplineId: string, token: string): Promise<void> => {
  const apiUrl = `http://localhost:8080/mental-health/api/v1/emergency-helpline/${helplineId}`;
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
