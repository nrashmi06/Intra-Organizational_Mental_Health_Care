import { LISTENER_APPLICATION_API_ENDPOINTS } from "@/mapper/listnerMapper";
import { setApplicationList } from "@/store/applicationListSlice";
import { RootState, AppDispatch } from "@/store";
import axiosInstance from "@/utils/axios";

interface ApprovalFilterParams {
  token: string;
  status: "PENDING" | "APPROVED" | "REJECTED";
  size: number;
  page: number;
}

export const getApplicationsByApprovalStatus =
  ({ token, status, size, page }: ApprovalFilterParams) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      // Get the cached ETag from Redux state
      const cachedEtag = getState().applicationList.etag;
      const headers = {
        Authorization: `Bearer ${token}`,
        ...(cachedEtag && { "If-None-Match": cachedEtag }), // Include ETag header if available
      };

      const response = await axiosInstance.get(
        LISTENER_APPLICATION_API_ENDPOINTS.GET_APPLICATION_BY_APPROVAL_STATUS,
        {
          params: { status, page, size }, // Pass query parameters
          headers,
          validateStatus: (status) => status >= 200 && status < 400,
        }
      );

      // If status 304, skip fetching data (use cached data)
      if (response.status === 304) {
        console.log("Using cached application data");
        return;
      }

      const etag = response.headers["etag"]; // Extract the ETag from response headers

      // Dispatch the fresh data to Redux
      dispatch(
        setApplicationList({
          applications: response.data.content,
          page: response.data.page,
          etag: etag || cachedEtag, // Save the new ETag or retain the old one
        })
      );

      return response.data;
    } catch (error: any) {
      console.error("Error fetching applications by approval status:", error);
      throw error;
    }
  };
