import { configureStore } from "@reduxjs/toolkit";
import { persistReducer, persistStore } from "redux-persist";
import storage from "redux-persist/lib/storage"; // Using sessionStorage
import chatReducer from "./chatSlice";
import emergencyReducer from "./emergencySlice";
import detailedApplicationSlice from "./detailedApplicationSlice";
import applicationListSlice from "./applicationListSlice";
import appointmentReducer from "./appointmentSlice";
import timeSlotReducer from "./timeSlotSlice";
import authReducer from "./authSlice";
import notificationReducer from "./notificationSlice";
import eventSourceReducer from "./eventsourceSlice";
import listenerReducer from './listenerSlice';
// Define  reducers
const authPersistConfig = {
  key: "auth",
  storage,
};

const notificationPersistConfig = {
  key: "notifications", // Key for notification storage
  storage, // Using sessionStorage
};

const chatPersistConfig = {
  key: "chat",
  storage,
};

const emergencyPersistConfig = {
  key: "emergency",
  storage,
};

const detailedApplicationPersistConfig = {
  key: "detailedApplication",
  storage,
};

const applicationListPersistConfig = {
  key: "applicationList",
  storage,
};

const appointmentPersistConfig = {
  key: "appointments",
  storage,
};

const timeSlotPersistConfig = {
  key: "timeSlots",
  storage,
};

const eventSourcePersistConfig = {
  key: "eventSource", // Key for eventSource storage
  storage,
};

const listenerPersistConfig = {
  key: 'listeners',
  storage,
};




// Persist reducers 
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedNotificationReducer = persistReducer(
  notificationPersistConfig,
  notificationReducer
);
const persistedChatReducer = persistReducer(chatPersistConfig, chatReducer);
const persistedEmergencyReducer = persistReducer(
  emergencyPersistConfig,
  emergencyReducer
);
const persistedDetailedApplicationReducer = persistReducer(
  detailedApplicationPersistConfig,
  detailedApplicationSlice
);
const persistedApplicationListReducer = persistReducer(
  applicationListPersistConfig,
  applicationListSlice
);
const persistedAppointmentReducer = persistReducer(
  appointmentPersistConfig,
  appointmentReducer
);
const persistedTimeSlotReducer = persistReducer(
  timeSlotPersistConfig,
  timeSlotReducer
);
const persistedEventSourceReducer = persistReducer(
  eventSourcePersistConfig,
  eventSourceReducer
);
const persistedListenerReducer = persistReducer(listenerPersistConfig, listenerReducer);

// Create the Redux store
const store = configureStore({
  reducer: {
    auth: persistedAuthReducer, // Use the persisted auth reducer
    notification: persistedNotificationReducer, // Add your notification reducer
    chat: persistedChatReducer, // Add your chat reducer
    emergency: persistedEmergencyReducer,
    detailedApplication: persistedDetailedApplicationReducer,
    applicationList: persistedApplicationListReducer,
    appointments: persistedAppointmentReducer,
    timeSlots: persistedTimeSlotReducer,
    Source: persistedEventSourceReducer,
    listeners: persistedListenerReducer,
  },
  devTools: process.env.NODE_ENV !== "production", // Enable Redux DevTools in development mode only
});

// Create the persistor
const persistor = persistStore(store);

// Export the store and persistor
export { store, persistor };

// Type definitions for convenience in TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;