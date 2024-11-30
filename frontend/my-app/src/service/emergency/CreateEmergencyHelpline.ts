import axios from 'axios';

const BASE_URL = 'http://localhost:8080/mental-health/api/v1';

export const createEmergencyHelpline = async (helplineData:{
    name: string;
    phoneNumber: string;
    countryCode: string;
    emergencyType: string;
    priority: number;
} , token: string) => {
  try {
    const response = await axios.post(`${BASE_URL}/emergency-helpline`, helplineData, {
      headers: {
        'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error creating emergency helpline:', error.response?.data || error.message);
    throw error;
  }
};
