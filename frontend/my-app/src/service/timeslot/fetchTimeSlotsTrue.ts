import axiosInstance from '@/utils/axios';
import { TIME_SLOT_API_ENDPOINTS } from '@/mapper/timeslotMapper'; // Adjust the path as needed

const fetchTimeSlots = async (
  adminId: string,
  startDate: string,
  endDate: string,
  isAvailable: boolean,
  token: string
) => {
  const url = TIME_SLOT_API_ENDPOINTS.GET_TIME_SLOTS_BY_ADMIN_IN_DATE_RANGE(adminId);

  try {
    const response = await axiosInstance.get(url, {
      params: {
        startDate,
        endDate,
        isAvailable,
        idType: "adminId",
      },
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    console.log('Time Slots:', response.data);
    return response.data.content; // Return the time slots data
  } catch (error: any) {
    if (error.response) {
      console.error('Error fetching time slots:', error.response.data || error.message);
    } else {
      console.error('Error fetching time slots:', error.message);
    }
    throw new Error('Failed to fetch time slots. Please try again later.');
  }
};

export default fetchTimeSlots;
