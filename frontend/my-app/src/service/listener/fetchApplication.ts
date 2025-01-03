import axios from "axios";
import { LISTENER_APPLICATION_API_ENDPOINTS } from "@/mapper/listnerMapper";
import { RootState, AppDispatch } from "@/store";
import { setDetailedApplication } from "@/store/detailedApplicationSlice"; // Import the action creator
import axiosInstance from "@/utils/axios";

export const fetchApplication =
  (accessToken: string, applicationId?: string | null) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      // Get the cached ETag from Redux (if any)
      const cachedEtag = getState().detailedApplication.etag; // Access state via getState
      const sanitizedEtag = cachedEtag
        ? cachedEtag.replace(/^\"|\"$/g, "")
        : "";

      console.log("Fetching application with ETag:", sanitizedEtag);

      // Set the `If-None-Match` header only if the ETag is available
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
    console.log("Response:", response.status);

      // Check the response status
      if (response.status === 200) {
        const newEtag = response.headers["etag"];
        // Update Redux store with fresh data and new ETag
        dispatch(
          setDetailedApplication({
            applicationData: response.data,
            etag: newEtag,
          })
        );
        return response.data; // Return the fresh data
      }

      // If status is 304 (Not Modified), simply return the cached data without making any changes
      if (response.status === 304) {
        console.log("Data not modified. Using cached data.");
        return null; // No need to overwrite data in Redux if it hasn't changed
      }
    } catch (error) {
      // Handle specific error scenarios gracefully
      if (axios.isAxiosError(error)) {
        if (error.response) {
          const status = error.response.status;

          if (status === 304) {
            console.log("Data not modified. Using cached data.");
            return null; // No changes
          }

          if (status === 404) {
            console.log("Application not found (404). Returning null.");
            return null; // Handle 404 gracefully without throwing
          }

          console.log("Error Response Status:", status);
        }
      }
    }
  };
