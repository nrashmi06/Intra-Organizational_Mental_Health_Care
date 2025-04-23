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

interface ApplicationResponse {
  content: any[]; // Replace 'any' with the actual type of your application data
  page: number;
}

export const getApplicationsByApprovalStatus =
  ({ token, status, size, page }: ApprovalFilterParams) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const cachedEtag = getState().applicationList.etag;
      const headers = {
        Authorization: `Bearer ${token}`,
        ...(cachedEtag && { "If-None-Match": cachedEtag }), 
      };

      const response = await axiosInstance.get(
        LISTENER_APPLICATION_API_ENDPOINTS.GET_APPLICATION_BY_APPROVAL_STATUS,
        {
          params: { status, page, size }, 
          headers,
          validateStatus: (status) => status >= 200 && status < 400,
        }
      );

      if (response.status === 304) {
        return;
      }

      const etag = response.headers["etag"]; 
      const data = response.data as ApplicationResponse; // Explicitly type response.data
      dispatch(
        setApplicationList({
          applications: data.content,
          page: data.page,
          etag: etag || cachedEtag, 
        })
      );

      return data;
    } catch (error: any) {
      console.error("Error fetching applications by approval status:", error);
    }
  };