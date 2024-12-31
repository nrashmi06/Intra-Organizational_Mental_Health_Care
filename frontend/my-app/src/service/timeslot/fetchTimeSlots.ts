// src/service/timeSlotApi.ts
import axiosInstance from "@/utils/axios";
import { TIME_SLOT_API_ENDPOINTS } from "@/mapper/timeslotMapper";
import { setTimeSlots} from "@/store/timeSlotSlice";
import { RootState, AppDispatch } from "@/store";

// Function to get the time slots based on the date range
export const fetchTimeSlots = (
  accessToken: string,
  userID: string | null,
  startDate: string,
  endDate: string,
  isAvailable: boolean,
  page: number,
  size: number
) => async (dispatch: AppDispatch, getState: () => RootState) => {
  try {
    // Validate userID
    if (!userID) {
      console.error("User ID is required to fetch time slots");
      return;
    }

    // Retrieve the ETag from the Redux store
    const cachedEtag = getState().timeSlots.etag;

    // Set headers with the cached ETag (if available)
    const headers = cachedEtag ? { "If-None-Match": cachedEtag } : {};

    const idType = "userId";
    const url = `${TIME_SLOT_API_ENDPOINTS.GET_TIME_SLOTS_BY_ADMIN_IN_DATE_RANGE(userID)}`;

    // Sending the GET request
    const response = await axiosInstance.get(url, {
      params: {
        startDate,
        endDate,
        isAvailable,
        idType,
        page,
        size,
      },
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...headers, 
      },
      validateStatus: (status) => status >= 200 && status < 400,
    });
    // Handle 304 (Not Modified) response
    if (response.status === 304) {
      console.log("Data not modified. Using cached time slots.");
      return; // No need to update the Redux store
    }

    // Dispatch the response data along with ETag and pagination
    dispatch(
      setTimeSlots({
        timeSlots: response.data.content,
        page: {
          size: response.data.page.size,
          number: response.data.page.number,
          totalElements: response.data.page.totalElements,
          totalPages: response.data.page.totalPages,
        },
        etag: response.headers["etag"] || null, // Get the ETag from response headers
      })
    );

  } catch (error) {
    console.error("Error fetching time slots:", error);
  }
};
