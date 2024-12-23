import axios from 'axios';
import { TIME_SLOT_API_ENDPOINTS } from '@/mapper/timeslotMapper';

export const confirmTimeSlots = async (accessToken: string,userID : string | null , timeSlots: any[], startDate: string, endDate: string) => {
  if (!userID) {
    throw new Error('userID cannot be null');
  }
  const url = `${TIME_SLOT_API_ENDPOINTS.CREATE_TIME_SLOTS_IN_DATE_RANGE(userID)}?startDate=${startDate}&endDate=${endDate}`;

  const requestBody = { 
    timeSlots
  };

  try {
    // Use axios to make the POST request
    const response = await axios.post(url, requestBody, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`,
      }
    });

    return response.data; // Return the response data
  } catch (error) {
    console.error('Error confirming selected time slots:', error);
    throw error; // Rethrow to handle in the calling function
  }
};
