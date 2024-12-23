import { TIME_SLOT_API_ENDPOINTS } from "@/mapper/timeslotMapper";

const deleteTimeSlots = async (
  token: string,
  userID: string | null,
  startDate: string,
  endDate: string
) => {
  try {
    if (!userID) {
      throw new Error("User ID is required to delete time slots.");
    }

    // Construct the URL using the mapper
    const url = `${TIME_SLOT_API_ENDPOINTS.DELETE_TIME_SLOTS_IN_DATE_RANGE(userID)}?startDate=${startDate}&endDate=${endDate}&isAvailable=true`;

    // Send the DELETE request
    const response = await fetch(url, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (response.status === 404) {
      console.warn("No time slots found for the specified date range.");
      return { message: "No data found for the specified date range." };
    }

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // Parse the response if it contains a body
    const text = await response.text(); // Read response as text
    return text ? JSON.parse(text) : { message: "Time slots deleted successfully." };
  } catch (error) {
    console.error("Error deleting time slots:", error);
    return { message: "An error occurred while deleting time slots." };
  }
};

export default deleteTimeSlots;
