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
      return; 
    }

    interface TimeSlotResponse {
      content: any[]; // Replace 'any[]' with the actual type of time slots if known
      page: {
        size: number;
        number: number;
        totalElements: number;
        totalPages: number;
      };
    }

    const data = response.data as TimeSlotResponse;

    dispatch(
      setTimeSlots({
        timeSlots: data.content,
        page: {
          size: data.page.size,
          number: data.page.number,
          totalElements: data.page.totalElements,
          totalPages: data.page.totalPages,
        },
        etag: response.headers["etag"] || null, // Get the ETag from response headers
      })
    );

  } catch (error) {
    console.error("Error fetching time slots:", error);
  }
};