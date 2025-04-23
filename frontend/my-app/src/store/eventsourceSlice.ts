import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EventSourceEntry {
  id: string; // A unique identifier for the EventSource, e.g., component name or purpose
  eventSource: EventSource; // The EventSource instance
}

interface EventSourceState {
  connections: EventSourceEntry[]; // Array to keep track of multiple EventSource instances
}

const initialState: EventSourceState = {
  connections: [],
};

const eventsourceSlice = createSlice({
  name: "eventSource",
  initialState,
  reducers: {
    addEventSource(state, action: PayloadAction<EventSourceEntry>) {
      // Add a new EventSource connection to the state
      state.connections.push(action.payload);
    },
    removeEventSource(state, action: PayloadAction<string>) {
      // Remove an EventSource by its unique ID
      state.connections = state.connections.filter(
        (connection) => connection.id !== action.payload
      );
    },
    clearEventSources(state) {
      state.connections.forEach((connection) => {
        if (
          connection?.eventSource &&
          typeof connection.eventSource.close === "function"
        ) {
          connection.eventSource.close();
        }
      });
      state.connections = [];
    },
  },
});

export const { addEventSource, removeEventSource, clearEventSources } =
  eventsourceSlice.actions;

export default eventsourceSlice.reducer;