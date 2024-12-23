import axios from "axios";
import { TIME_SLOT_API_ENDPOINTS } from "@/mapper/timeslotMapper";

// Function to get the time slots based on the date range
export const fetchTimeSlots = async (
  accessToken: string,
  userID: string | null,
  startDate: string,
  endDate: string
) => {
  try {
    // Validate userID
    if (!userID) {
      throw new Error("User ID is required to fetch time slots.");
    }

    // Construct the URL using the mapper
    const url = `${TIME_SLOT_API_ENDPOINTS.GET_TIME_SLOTS_BY_ADMIN_IN_DATE_RANGE(userID)}?startDate=${startDate}&endDate=${endDate}`;

    // Sending the GET request
    const response = await axios.get(url, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`, // Send the access token in the headers
      },
    });

    return response.data; // Return the time slots data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error("Error fetching time slots:", error.response?.data);
    } else {
      console.error("Error fetching time slots:", error);
    }
    throw error; // Rethrow to handle in the calling function
  }
};
