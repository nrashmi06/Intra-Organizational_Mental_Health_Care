import { APPOINTMENT_API_ENDPOINTS } from "@/mapper/appointmentMapper";
import { setAppointments } from "@/store/appointmentSlice";
import { RootState, AppDispatch } from "@/store";
import axiosInstance from "@/utils/axios";

interface FilterParams {
  timeFilter: string;
  status: string;
  page: number;
  size: number;
  userId: string;
}

export const getAppointmentsByFilter =
  ({ timeFilter, status, page, size, userId }: FilterParams) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const cachedEtag = getState().appointments.etag;
      const headers = cachedEtag ? { "If-None-Match": cachedEtag } : {};

      interface AppointmentResponse {
        content: any[]; // Replace 'any[]' with the actual type of appointments if known
        page: number;
      }

      const response = await axiosInstance.get<AppointmentResponse>(
        APPOINTMENT_API_ENDPOINTS.GET_APPOINTMENTS_BY_FILTER,
        {
          params: {
            timeFilter: timeFilter === "ALL" ? undefined : timeFilter,
            status: status === "ALL" ? undefined : status,
            page,
            size,
            adminID: userId,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.accessToken}`,
            ...headers,
          },
          validateStatus: (status) => status >= 200 && status < 400,
        }
      );

      if(response.status === 404)
      {
        return;
      }

      if (response.status === 304) {
        return;
      }

      const etag = response.headers["etag"];

      dispatch(
        setAppointments({
          appointments: response.data.content,
          page: response.data.page,
          etag: etag || cachedEtag,
        })
      );

      return response.data;
    } catch (error: any) {
      console.error("Error fetching appointments:", error);
    }
  };