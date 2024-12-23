import axios from 'axios';
import { EMERGENCY_API_ENDPOINTS } from '@/mapper/emergencyMapper';

export const createEmergencyHelpline = async (helplineData:{
    name: string;
    phoneNumber: string;
    countryCode: string;
    emergencyType: string;
    priority: number;
} , token: string) => {
  try {
    const response = await axios.post(`${EMERGENCY_API_ENDPOINTS.CREATE_EMERGENCY}`, helplineData, {
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
