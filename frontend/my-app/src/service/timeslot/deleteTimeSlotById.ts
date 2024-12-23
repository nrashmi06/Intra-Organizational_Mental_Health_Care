import { TIME_SLOT_API_ENDPOINTS } from "@/mapper/timeslotMapper";

const handleDeleteTimeSlot = async (
  token: string,
  userID: string | null,
  timeSlotId: string
) => {
  try {
    // Validate userID
    if (!userID) {
      throw new Error("User ID is required to delete the time slot.");
    }

    // Construct the API URL using the mapper
    const url = TIME_SLOT_API_ENDPOINTS.DELETE_TIME_SLOT_BY_ID(userID, timeSlotId);

    // Send DELETE request
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to delete the time slot. Status: ${response.status}`);
    }

    return { message: "Time slot deleted successfully." };
  } catch (error) {
    console.error("Error deleting time slot:", error);
    return { message: "An error occurred while deleting the time slot." };
  }
};

export default handleDeleteTimeSlot;
