import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Appointment } from "@/lib/types";

interface Page {
  size: number;
  number: number;
  totalElements: number;
  totalPages: number;
}

interface AppointmentState {
  appointments: Appointment[];
  page: Page | null;
  etag: string | null; // Add the etag property
}

const initialState: AppointmentState = {
  appointments: [],
  page: null,
  etag: null, // Initialize etag as null
};

const appointmentSlice = createSlice({
  name: "appointments",
  initialState,
  reducers: {
    setAppointments: (
      state,
      action: PayloadAction<{
        appointments: Appointment[];
        page: any;
        etag: string | null;
      }>
    ) => {
      state.appointments = action.payload.appointments;
      state.page = action.payload.page;
      state.etag = action.payload.etag;
    },
    clearAppointments: (state) => {
      state.appointments = [];
      state.page = null;
      state.etag = null; // Clear the etag as well
    },
  },
});

export const { setAppointments, clearAppointments } = appointmentSlice.actions;

export default appointmentSlice.reducer;