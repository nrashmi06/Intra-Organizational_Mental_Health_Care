import axiosInstance from "@/utils/axios";
import { TIME_SLOT_API_ENDPOINTS } from "@/mapper/timeslotMapper";

const handleUpdateTimeSlot = async (
  token: string,
  userID: string | null,
  timeSlotId: string,
  startTime: string,
  endTime: string
) => {
  if (!userID) {
    console.error('User ID is missing');
    return;
  }

  try {
    console.log("start", startTime);
    console.log("end", endTime);

    const url = `${TIME_SLOT_API_ENDPOINTS.UPDATE_TIME_SLOTS_BY_ID(userID, timeSlotId)}?idType=userId`;

    await axiosInstance.put(url, 
      { startTime, endTime },
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

  } catch (error: any) {
    if (error.response) {
      const errorMessage = error.response.data?.message || 'Failed to update the time slot';
      console.error('Error updating time slot:', errorMessage);
    } else {
      console.error('Error updating time slot:', error.message || error);
    }
  }
};

export default handleUpdateTimeSlot;
