import { APPOINTMENT_API_ENDPOINTS } from "@/mapper/appointmentMapper";
import { setAppointments } from "@/store/appointmentSlice";
import { RootState, AppDispatch } from "@/store"; 
import axiosInstance from "@/utils/axios";

interface AppointmentResponse {
  content: any[]; // Replace 'any[]' with the actual type of appointments if known
  page: number;
}

export const getAppointmentByDate =
  (startDate: string, endDate: string, page: number, size: number) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const cachedEtag = getState().appointments.etag;

      const headers = cachedEtag ? { "If-None-Match": cachedEtag } : {};

      const response = await axiosInstance.get(
        APPOINTMENT_API_ENDPOINTS.GET_APPOINTMENTS_BY_DATE_RANGE,
        {
          params: { startDate, endDate, page, size },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.accessToken}`,
            ...headers
          },
          validateStatus: (status) => status >= 200 && status < 400, 
        }
      );
      const etag = response.headers["etag"];
      const data = response.data as AppointmentResponse;

      if (etag) {
        dispatch(
          setAppointments({
            appointments: data.content,
            page: data.page,
            etag,
          })
        );
      } else {
        dispatch(
          setAppointments({
            appointments: data.content,
            page: data.page,
            etag: cachedEtag,
          })
        );
      }
    } catch (error: any) {
      if (error.response && error.response.status !== 304) {
        console.error("Error fetching appointments:", error);
      }
    }
  };