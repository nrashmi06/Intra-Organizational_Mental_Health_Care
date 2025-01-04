import axios from "axios";
import { LISTENER_APPLICATION_API_ENDPOINTS } from "@/mapper/listnerMapper";
import { RootState, AppDispatch } from "@/store";
import { setDetailedApplication } from "@/store/detailedApplicationSlice"; 
import axiosInstance from "@/utils/axios";

export const fetchApplication =
  (accessToken: string, applicationId?: string | null) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const cachedEtag = getState().detailedApplication.etag; 
      const sanitizedEtag = cachedEtag
        ? cachedEtag.replace(/^\"|\"$/g, "")
        : "";

      const headers: Record<string, string> = {
        Authorization: `Bearer ${accessToken}`,
      };

      if (sanitizedEtag) {
        headers["If-None-Match"] = sanitizedEtag;
      }

      const url = applicationId
        ? `${LISTENER_APPLICATION_API_ENDPOINTS.GET_APPLICATION_BY_ID}?applicationId=${applicationId}`
        : LISTENER_APPLICATION_API_ENDPOINTS.GET_APPLICATION_BY_ID;

    const response = await axiosInstance.get(url, { headers });

      if (response.status === 200) {
        const newEtag = response.headers["etag"];
        dispatch(
          setDetailedApplication({
            applicationData: response.data,
            etag: newEtag,
          })
        );
        return response.data; // Return the fresh data
      }

      if (response.status === 304) {
        return null; 
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;

          if (status === 304) {
            console.log("Data not modified. Using cached data.");
            return null; 
          }

          if (status === 404) {
            console.log("Application not found (404). Returning null.");
            return null;
          }

          console.log("Error Response Status:", status);
        }
      }
    }
  };
