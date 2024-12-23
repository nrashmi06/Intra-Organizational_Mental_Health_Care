
import axios from 'axios';
import { EMERGENCY_API_ENDPOINTS } from '@/mapper/emergencyMapper';

// Function to fetch all emergency helplines
export async function getAllHelplines( token: string) {
  try {
    //get access token from reduc
    
    const response = await axios.get(EMERGENCY_API_ENDPOINTS.GET_ALL_EMERGENCY, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    });
    return response.data; 
  } catch (error) {
    console.error('Error fetching helplines:', error);
    return []; // Return an empty array in case of error
  }
}
