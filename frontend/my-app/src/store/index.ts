import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Your auth reducer
import notificationReducer from './notificationSlice'; // Import your notification slice
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session'; // Using sessionStorage
import chatReducer from './chatSlice';
import emergencyReducer from './emergencySlice'; 
import detailedApplicationSlice from './detailedApplicationSlice'; 
import applicationListSlice from './applicationListSlice';
import appointmentReducer from './appointmentSlice'; 
import timeSlotReducer from './timeSlotSlice';
import listenerReducer from './listenerSlice';
// Define  reducers
const authPersistConfig = {
  key: 'auth',  
  storage,      
};

const notificationPersistConfig = {
  key: 'notifications',  // Key for storage
  storage,               // Using sessionStorage
};

const chatPersistConfig = {
  key: 'chat', 
  storage,     
};

const emergencyPersistConfig = {
  key: 'emergency', 
  storage,      
};

const detailedApplicationPersistConfig = {
  key: 'detailedApplication',
  storage,
};

const applicationListPersistConfig = {
  key: 'applicationList',
  storage,
};

const appointmentPersistConfig = {
  key: 'appointments',
  storage,
};

const timeSlotPersistConfig = {
  key: 'timeSlots',
  storage,
};

const listenerPersistConfig = {
  key: 'listeners',
  storage,
};


// Persist the auth and notification reducers separately
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedNotificationReducer = persistReducer(notificationPersistConfig, notificationReducer);
const persistedChatReducer = persistReducer(chatPersistConfig, chatReducer);
const persistedEmergencyReducer = persistReducer(emergencyPersistConfig, emergencyReducer);
const persistedDetailedApplicationReducer = persistReducer(detailedApplicationPersistConfig, detailedApplicationSlice);
const persistedApplicationListReducer = persistReducer(applicationListPersistConfig, applicationListSlice);
const persistedAppointmentReducer = persistReducer(appointmentPersistConfig, appointmentReducer);
const persistedTimeSlotReducer = persistReducer(timeSlotPersistConfig, timeSlotReducer);
const persistedListenerReducer = persistReducer(listenerPersistConfig, listenerReducer);

// Create the Redux store
const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,  // Use the persisted auth reducer
    notification: persistedNotificationReducer, // Add your notification reducer
    chat: persistedChatReducer, // Add your chat reducer
    emergency: persistedEmergencyReducer, 
    detailedApplication: persistedDetailedApplicationReducer,
    applicationList: persistedApplicationListReducer,
    appointments: persistedAppointmentReducer,
    timeSlots: persistedTimeSlotReducer,
    listeners: persistedListenerReducer,
  },
  devTools: true, // Enable Redux DevTools in development
});

// Create the persistor for Redux Persist
const persistor = persistStore(store); // Type for persistor is already inferred from persistStore

// Export the store and persistor for use in _app.tsx
export { store, persistor };

// Type the RootState and AppDispatch for useSelector and useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
