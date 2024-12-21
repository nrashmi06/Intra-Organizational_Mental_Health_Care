import axios from 'axios';

const fetchTimeSlots = async (adminId : string, startDate : string, endDate : string, isAvailable : boolean, token : string) => {
  const url = `http://localhost:8080/mental-health/api/v1/time-slots/${adminId}/date-range`;

  try {
    const response = await axios.get(url, {
      params: {
        startDate,
        endDate,
        isAvailable,
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Time Slots:', response.data);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching time slots:', error.response?.data || error.message);
    } else {
      console.error('Error fetching time slots:', (error as Error).message);
    }
    throw error;
  }
};

export default fetchTimeSlots;
