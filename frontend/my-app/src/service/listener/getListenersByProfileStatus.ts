import { LISTENER_API_ENDPOINTS } from "@/mapper/listenerProfileMapper";
import { setListeners } from "@/store/listenerSlice";
import { RootState, AppDispatch } from "@/store";
import axiosInstance from '@/utils/axios';

interface FilterParams {
  status: string;
  page: number;
  size: number;
  userId?: string;
  search?: string;
}

export const getListenersByProfileStatus =
  ({ status, page, size, userId, search }: FilterParams) =>
  async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const cachedEtag = getState().listeners.etag;
      const headers = cachedEtag ? { "If-None-Match": cachedEtag } : {};

      const response = await axiosInstance.get(
        LISTENER_API_ENDPOINTS.GET_ALL_LISTENERS_BY_STATUS,
        {
          params: {
            status: status === "ALL" ? "active" : status, 
            page,
            size,
            adminID: userId,
            ...(search ? { search } : {}),
          },
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${getState().auth.accessToken}`,
            ...headers,
          },
          validateStatus: (status) => status >= 200 && status < 400,
        }
      );

      if (response.status === 304) {
        return;
      }

      const etag = response.headers["etag"]; 
      dispatch(
        setListeners({
          listeners: response.data.content,
          page: response.data.page,
          etag: etag || cachedEtag, 
        })
      );

      return response.data;
    } catch (error: any) {
      console.error("Error fetching listeners:", error);
    }
  };
