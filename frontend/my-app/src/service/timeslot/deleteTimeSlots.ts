import axiosInstance from "@/utils/axios"; // Import your Axios instance
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
    const url = `${TIME_SLOT_API_ENDPOINTS.DELETE_TIME_SLOTS_IN_DATE_RANGE(userID)}?startDate=${startDate}&endDate=${endDate}&isAvailable=true&idType=userId`;

    // Send the DELETE request using axiosInstance
    const response = await axiosInstance.delete(url, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Handle different status codes
    if (response.status === 404) {
      console.warn("No time slots found for the specified date range.");
      return { message: "No data found for the specified date range." };
    }

    // Check if the response contains a message or data
    if (response.status === 200) {
      return response.data || { message: "Time slots deleted successfully." };
    }

    throw new Error(`HTTP error! Status: ${response.status}`);
  } catch (error) {
    console.error("Error deleting time slots:", error);
    return { message: "An error occurred while deleting time slots." };
  }
};

export default deleteTimeSlots;
