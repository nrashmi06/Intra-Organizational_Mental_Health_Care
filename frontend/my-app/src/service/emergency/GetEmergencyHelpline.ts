import { EMERGENCY_API_ENDPOINTS } from '@/mapper/emergencyMapper';
import { setHelplines } from '@/store/emergencySlice';  
import { RootState, AppDispatch } from '@/store';
import axiosInstance from '@/utils/axios';

export const getAllHelplines = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  try {
    const cachedEtag = getState().emergency.etag;
    const headers = cachedEtag ? { 'If-None-Match': cachedEtag } : {};

    const response = await axiosInstance.get(EMERGENCY_API_ENDPOINTS.GET_ALL_EMERGENCY, {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },  
    });

    if (response.status === 304) {
      return;
    }

    const etag = response.headers['etag'];

    if (etag) {
      dispatch(setHelplines({ helplines: response.data as any[], etag }));
    } else {
      dispatch(setHelplines({ helplines: response.data as any[], etag: cachedEtag }));
    }
  } catch (error: any) {
    if (error.response && error.response.status !== 304) {
      console.error('Error fetching helplines:', error);
    }
  }
};