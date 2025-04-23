// src/store/emergencySlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface EmergencyState {
  helplines: any[]; // Array to store helplines
  etag: string | null; // ETag for caching purposes
}

const initialState: EmergencyState = {
  helplines: [], // Initialize as an empty array
  etag: null, // Initialize etag as null
};

const emergencySlice = createSlice({
  name: 'emergency',
  initialState,
  reducers: {
    setHelplines: (state, action: PayloadAction<{ helplines: any[]; etag: string | null }>) => {
      state.helplines = action.payload.helplines;
      state.etag = action.payload.etag;
    },
    clearHelplines: (state) => {
      state.helplines = []; // Reset helplines array
      state.etag = null; // Reset etag to null
    },
  },
});

// Export actions
export const { setHelplines, clearHelplines } = emergencySlice.actions;
export default emergencySlice.reducer;