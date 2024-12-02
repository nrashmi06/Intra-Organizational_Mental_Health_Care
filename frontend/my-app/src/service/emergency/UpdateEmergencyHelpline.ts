import axios from "axios";

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
      `http://localhost:8080/mental-health/api/v1/emergency-helpline/${helplineId}`,
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
