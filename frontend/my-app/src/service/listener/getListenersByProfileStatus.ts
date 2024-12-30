import { LISTENER_API_ENDPOINTS } from "@/mapper/listenerProfileMapper";
import { setListeners } from "@/store/listenerSlice";
import { RootState, AppDispatch } from "@/store";

interface FilterParams {
  status: string;
  page: number;
  size: number;
  userId: string;
}

export const getListenersByProfileStatus =
  ({ status, page, size, userId }: FilterParams) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      // Get the cached ETag from Redux state
      const cachedEtag = getState().listeners.etag;
      const headers = cachedEtag ? { "If-None-Match": cachedEtag } : {};

      const response = await axios.get(
        LISTENER_API_ENDPOINTS.GET_ALL_LISTENERS_BY_STATUS(status),
        {
          params: {
            status: status === "ALL" ? "active" : status, // default to 'active' if status is 'ALL'
            page,
            size,
            adminID: userId,
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.accessToken}`,
            ...headers, // Include cached ETag if present
          },
          validateStatus: (status) => status >= 200 && status < 400,
        }
      );

      // If status 304, skip fetching data (use cached data)
      if (response.status === 304) {
        console.log("Using cached listener data");
        return;
      }

      const etag = response.headers["etag"]; // Extract the ETag from response headers

      // Dispatch the fresh data to Redux
      dispatch(
        setListeners({
          listeners: response.data.content,
          page: response.data.page,
          etag: etag || cachedEtag, // Save the new ETag or retain the old one
        })
      );

      return response.data;
    } catch (error: any) {
      console.error("Error fetching listeners:", error);
      throw error;
    }
  };
