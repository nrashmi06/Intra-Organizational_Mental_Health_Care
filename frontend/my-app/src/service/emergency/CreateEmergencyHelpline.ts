import { EMERGENCY_API_ENDPOINTS } from '@/mapper/emergencyMapper';
import axiosInstance from '@/utils/axios';

export const createEmergencyHelpline = async (helplineData:{
    name: string;
    phoneNumber: string;
    countryCode: string;
    emergencyType: string;
    priority: number;
} , token: string) => {
  try {
    const response = await axiosInstance.post(`${EMERGENCY_API_ENDPOINTS.CREATE_EMERGENCY}`, helplineData, {
      headers: {
        'Content-Type': 'application/json',
         Authorization: `Bearer ${token}`,
      },
    });
    return response.data;
  } catch (error: any) {
    console.error('Error creating emergency helpline:', error.response?.data || error.message);
  }
};
