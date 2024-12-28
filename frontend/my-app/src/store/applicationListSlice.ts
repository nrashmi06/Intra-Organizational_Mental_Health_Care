import { createSlice } from "@reduxjs/toolkit";

const applicationListSlice = createSlice({
  name: "applicationList",
  initialState: [],
  reducers: {
    setApplicationList: (state, action) => action.payload, // Replace the state with the new list of applications
    clearApplicationList: () => [], // Clear the application list
  },
});

export const { setApplicationList, clearApplicationList } = applicationListSlice.actions;
export default applicationListSlice.reducer;
