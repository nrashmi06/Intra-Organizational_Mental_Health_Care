import axios from 'axios';

export const confirmTimeSlots = async (accessToken: string, timeSlots: any[], startDate: string, endDate: string) => {
  const url = `http://localhost:8080/mental-health/api/v1/time-slots/1/date-range?startDate=${startDate}&endDate=${endDate}`;

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
