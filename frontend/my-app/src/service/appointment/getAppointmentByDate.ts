import { APPOINTMENT_API_ENDPOINTS } from "@/mapper/appointmentMapper";
import { setAppointments } from "@/store/appointmentSlice";
import { RootState, AppDispatch } from "@/store"; 
import axiosInstance from "@/utils/axios";

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

      if (response.status === 304) {
        return;
      }

      const etag = response.headers["etag"];

      if (etag) {
        dispatch(
          setAppointments({
            appointments: response.data.content,
            page: response.data.page,
            etag,
          })
        );
      } else {
        dispatch(
          setAppointments({
            appointments: response.data.content,
            page: response.data.page,
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
