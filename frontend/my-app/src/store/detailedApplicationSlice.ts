import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface DetailedApplicationState {
  applicationData: any | null; // Replace `any` with the specific type for application data if available
  etag: string | null; // To store the ETag value
}

const initialState: DetailedApplicationState = {
  applicationData: null,
  etag: null,
};

const detailedApplicationSlice = createSlice({
  name: "detailedApplication",
  initialState,
  reducers: {
    setDetailedApplication: (
      state,
      action: PayloadAction<{ applicationData: any; etag: string | null }>
    ) => {
      state.applicationData = action.payload.applicationData;
      state.etag = action.payload.etag;
    },
    clearDetailedApplication: (state) => {
      state.applicationData = null;
      state.etag = null;
    },
  },
});

export const { setDetailedApplication, clearDetailedApplication } = detailedApplicationSlice.actions;
export default detailedApplicationSlice.reducer;