import axiosInstance from "@/utils/axios"; // Import the Axios instance
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
    return; // Early return if userID is null or undefined
  }

  try {
    console.log("start", startTime);
    console.log("end", endTime);

    // Construct the API URL with the appropriate userID and timeSlotId
    const url = `${TIME_SLOT_API_ENDPOINTS.UPDATE_TIME_SLOTS_BY_ID(userID, timeSlotId)}?idType=userId`;

    // Send PUT request using axiosInstance to update the time slot
    const response = await axiosInstance.put(url, 
      { startTime, endTime },  // Body data containing the new start and end times
      {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }
    );

    // Handle the successful response
    console.log('Time slot updated successfully:', response.data);
    // You can update the UI, close modal, or handle the successful response here

  } catch (error: any) {
    // Handle error response
    if (error.response) {
      // If the error contains a response (e.g., 400, 404, etc.)
      const errorMessage = error.response.data?.message || 'Failed to update the time slot';
      console.error('Error updating time slot:', errorMessage);
    } else {
      // If no response, log the error (e.g., network error)
      console.error('Error updating time slot:', error.message || error);
    }
  }
};

export default handleUpdateTimeSlot;
