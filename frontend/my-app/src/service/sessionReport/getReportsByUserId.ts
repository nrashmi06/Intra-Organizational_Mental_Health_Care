import { UserReport } from '@/lib/types';
import axios from 'axios';
import { REPORT_API_ENDPOINTS } from '@/mapper/reportMapper';
export const getUserReportsByUserId = async (userId: string, accessToken: string): Promise<UserReport[]> => {
  try {
    const response = await axios.get<UserReport[]>(REPORT_API_ENDPOINTS.GET_ALL_USER_REPORTS_BY_USER_ID(userId), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching user reports:', error);
    throw error;
  }
};