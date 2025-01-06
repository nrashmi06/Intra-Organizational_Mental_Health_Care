import { UserReport } from '@/lib/types';
import axiosInstance from '@/utils/axios';
import { REPORT_API_ENDPOINTS } from '@/mapper/reportMapper';
export const getUserReportsByUserId = async (userId: string, accessToken: string) => {
  try {
    const response = await axiosInstance.get<UserReport[]>(REPORT_API_ENDPOINTS.GET_ALL_USER_REPORTS_BY_USER_ID(userId), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user reports:', error);
  }
};