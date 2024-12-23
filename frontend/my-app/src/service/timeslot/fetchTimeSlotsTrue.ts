import axios from 'axios';
import { TIME_SLOT_API_ENDPOINTS } from '@/mapper/timeslotMapper'; // Adjust the path as needed

const fetchTimeSlots = async (
  adminId: string,
  startDate: string,
  endDate: string,
  isAvailable: boolean,
  token: string
) => {
  // Use the mapper to construct the URL
  const url = TIME_SLOT_API_ENDPOINTS.GET_TIME_SLOTS_BY_ADMIN_IN_DATE_RANGE(adminId);

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
    return response.data; // Return the time slots data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error('Error fetching time slots:', error.response?.data || error.message);
    } else {
      console.error('Error fetching time slots:', (error as Error).message);
    }
    throw new Error('Failed to fetch time slots. Please try again later.');
  }
};

export default fetchTimeSlots;
