import axiosInstance from '@/utils/axios'; // Import the Axios instance
import { TIME_SLOT_API_ENDPOINTS } from '@/mapper/timeslotMapper';

export const confirmTimeSlots = async (accessToken: string,userID : string | null , timeSlots: any[], startDate: string, endDate: string) => {
  if (!userID) {
    throw new Error('userID cannot be null');
  }
  const url = `${TIME_SLOT_API_ENDPOINTS.CREATE_TIME_SLOTS_IN_DATE_RANGE(userID)}?startDate=${startDate}&endDate=${endDate}&idType=userId`;

  const requestBody = { 

    timeSlots
  };

  try {
    const response = await axiosInstance.post(url, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }
    });

    return response.data; 
  } catch (error) {
    console.error('Error confirming selected time slots:', error);
  }
};
