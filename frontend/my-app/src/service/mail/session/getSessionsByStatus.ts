import { SESSION_API_ENDPOINTS } from "@/mapper/sessionMapper";
import axiosInstance from "@/utils/axios";

interface GetSessionsByStatusParams {
  accessToken: string;
  status?: string;
  page?: number;
  size?: number;
  idType?: string;
  id?: number;
}

export const getSessionsByStatus = async ({
  accessToken,
  status = "completed",
  page = 0,
  size = 4,
  idType,
  id,
}: GetSessionsByStatusParams) => {
  try {
    const url = new URL(SESSION_API_ENDPOINTS.GET_SESSIONS_BY_STATUS);
    url.searchParams.append('status', status);
    url.searchParams.append('page', page.toString());
    url.searchParams.append('size', size.toString());
    if (idType) {
      url.searchParams.append('idType', idType);
    }
    if (id) {
      url.searchParams.append('id', id.toString());
    }
    const response = await axiosInstance.get(url.toString(), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    console.log("PAGINATED SEssions RESPONSE", response);
    return response.data;
  } catch (error) {
    console.error("Error fetching sessions by status:", error);
  }
};