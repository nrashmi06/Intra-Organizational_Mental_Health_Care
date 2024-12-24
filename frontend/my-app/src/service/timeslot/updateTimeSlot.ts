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
    return;  // Early return if userID is null or undefined
  }

  try {
    console.log("start", startTime);
    console.log("end", endTime);
    
    // Construct the API URL with the appropriate userID and timeSlotId
    const url = `${TIME_SLOT_API_ENDPOINTS.UPDATE_TIME_SLOTS_BY_ID(userID, timeSlotId)}`;
    
    // Send PUT request to update the time slot
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ startTime, endTime }),  // Pass the new start and end times
    });

    // Check if the response was successful
    if (!response.ok) {
      let errorMessage = 'Failed to update the time slot';
      const responseText = await response.text(); // Read as text first for debugging

      try {
        const errorData = JSON.parse(responseText); // Try to parse the response text as JSON
        errorMessage = errorData.message || errorMessage;
      } catch (error) {
        // If response is not JSON, log the plain text error
        console.error('Error response is not JSON:', responseText);
      }

      throw new Error(errorMessage);
    }

    const data = await response.json(); // Now parse the successful response as JSON
    console.log('Time slot updated successfully:', data);
    // You can update the UI, close modal, or handle the successful response here
  } catch (error) {
    console.error('Error updating time slot:', error);
    // Optionally, display an error message to the user or trigger UI feedback
  }
};

export default handleUpdateTimeSlot;
