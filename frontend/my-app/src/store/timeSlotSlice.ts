// src/store/slices/timeSlotSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TimeSlot {
  timeSlotId: number;
  date: string;
  startTime: string;
  endTime: string;
  isAvailable: boolean;
}

interface Page {
    size: number;
    number: number;
    totalElements: number;
    totalPages: number;
  }

interface TimeSlotState {
  timeSlots: TimeSlot[];
  page: Page | null,
  etag: string | null;
}

const initialState: TimeSlotState = {
  timeSlots: [],
  page: null,
  etag: null,
};

const timeSlotSlice = createSlice({
  name: "timeSlot",
  initialState,
  reducers: {
    setTimeSlots: (
      state,
      action: PayloadAction<{ timeSlots: TimeSlot[]; page : Page; etag: string | null }>
    ) => {
      state.timeSlots = action.payload.timeSlots;
      state.page = action.payload.page;
      state.etag = action.payload.etag;
    },
    clearTimeSlots: (state) => {
      state.timeSlots = [];
      state.page = null;
      state.etag = null;
    },
  },
});

export const { setTimeSlots, clearTimeSlots } = timeSlotSlice.actions;
export default timeSlotSlice.reducer;