import axios from 'axios';

// Function to get the time slots based on the date range
export const fetchTimeSlots = async (accessToken : string ,startDate : string, endDate : string) => {
  const url = `http://localhost:8080/mental-health/api/v1/time-slots/1/date-range?startDate=${startDate}&endDate=${endDate}`;

  try {
    // Sending the GET request
    const response = await axios.get(url, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`, // Send the access token in the headers
      },
    });

    return response.data; // Return the time slots data
  } catch (error) {
    console.error('Error fetching time slots:', error);
    throw error; // Rethrow to handle in the calling function
  }
};
