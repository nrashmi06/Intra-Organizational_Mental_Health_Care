
import axios from 'axios';

// Function to fetch all emergency helplines
export async function getAllHelplines( token: string) {
  try {
    //get access token from reduc
    
    const response = await axios.get('http://localhost:8080/mental-health/api/v1/emergency-helpline', {
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
