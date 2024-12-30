// src/api/emergencyApi.js
import axios from 'axios';
import { EMERGENCY_API_ENDPOINTS } from '@/mapper/emergencyMapper';
import { setHelplines } from '@/store/emergencySlice';
import { RootState, AppDispatch } from '@/store'; // Import AppDispatch for dispatch type

// Thunk action to fetch all emergency helplines with ETag handling
export const getAllHelplines = () => async (dispatch: AppDispatch, getState: () => RootState) => {
  try {
    // Get the cached ETag from Redux (if any)
    const cachedEtag = getState().emergency.etag;

    // Set the `If-None-Match` header if the ETag is available
    const headers = cachedEtag ? { 'If-None-Match': cachedEtag } : {};

    const response = await axios.get(EMERGENCY_API_ENDPOINTS.GET_ALL_EMERGENCY, {
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
    });

    if (response.status === 304) {
      // If the response is 304, no new data, log and return early
      console.log("No changes to helplines, using cached data");
      return; // Exit early, don't update the state
    }

    // Get the new ETag from the response headers
    const etag = response.headers['etag'];

    // If the response contains a new ETag, store it in Redux
    if (etag) {
      dispatch(setHelplines({ helplines: response.data, etag }));
    } else {
      // If no ETag is provided, store the data without an ETag
      dispatch(setHelplines({ helplines: response.data, etag: cachedEtag }));
    }
  } catch (error: any) {
    // Handle any other error but not 304
    if (error.response && error.response.status !== 304) {
      console.error('Error fetching helplines:', error);
    }
  }
};
