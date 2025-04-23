
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface Application {
  applicationId: number;
  fullName: string;
  branch: string;
  semester: number;
  applicationStatus: string;
  certificateUrl: string;
}

interface Page {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

interface ApplicationState {
  applications: Application[];
  page: Page | null;
  etag: string | null; // Add the etag property
}

const initialState: ApplicationState = {
  applications: [],
  page: null,
  etag: null, // Initialize etag as null
};

const applicationListSlice = createSlice({
  name: "applicationList",
  initialState,
  reducers: {
    setApplicationList: (
      state,
      action: PayloadAction<{
        applications: Application[];
        page: any;
        etag: string | null;
      }>
    ) => {
      state.applications = action.payload.applications;
      state.page = action.payload.page;
      state.etag = action.payload.etag;
    },
    clearApplicationList: (state) => {
      state.applications = [];
      state.page = null;
      state.etag = null; 
    },
  },
});

export const { setApplicationList, clearApplicationList } = applicationListSlice.actions;

export default applicationListSlice.reducer;