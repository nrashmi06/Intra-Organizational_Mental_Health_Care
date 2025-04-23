import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Listener } from "@/lib/types"; // Adjust the import path for your Listener type

interface Page {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

interface ListenerState {
  listeners: any[]; // Assuming you have a Listener type
  page: Page | null;
  etag: string | null; // Store the ETag value
}

const initialState: ListenerState = {
  listeners: [],
  page: null,
  etag: null, // Initialize ETag as null
};

const listenerSlice = createSlice({
  name: "listeners",
  initialState,
  reducers: {
    setListeners: (
      state,
      action: PayloadAction<{
        listeners: any[]; // An array of listeners
        page: any; // Pagination details
        etag: string | null; // The ETag value
      }>
    ) => {
      state.listeners = action.payload.listeners;
      state.page = action.payload.page;
      state.etag = action.payload.etag;
    },
    clearListeners: (state) => {
      state.listeners = [];
      state.page = null;
      state.etag = null; // Clear the ETag as well
    },
  },
});

export const { setListeners, clearListeners } = listenerSlice.actions;

export default listenerSlice.reducer;