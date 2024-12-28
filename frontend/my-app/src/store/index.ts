import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Your auth reducer
import notificationReducer from './notificationSlice'; // Import your notification slice
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session'; // Using sessionStorage
import chatReducer from './chatSlice'; // Import your chat slice
import emergencyReducer from './emergencySlice'; // Import your emergency slice

// Define the persist config for auth reducer
const authPersistConfig = {
  key: 'auth',  // Key for storage
  storage,      // Using sessionStorage
};

// Define the persist config for notification reducer
const notificationPersistConfig = {
  key: 'notifications',  // Key for storage
  storage,               // Using sessionStorage
};

// Define the persist config for chat reducer
const chatPersistConfig = {
  key: 'chat',  // Key for storage
  storage,      // Using sessionStorage
};

const emergencyPersistConfig = {
  key: 'emergency',  // Key for storage
  storage,      // Using sessionStorage
};

// Persist the auth and notification reducers separately
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedNotificationReducer = persistReducer(notificationPersistConfig, notificationReducer);
const persistedChatReducer = persistReducer(chatPersistConfig, chatReducer);
const persistedEmergencyReducer = persistReducer(emergencyPersistConfig, emergencyReducer);

// Create the Redux store
const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,  // Use the persisted auth reducer
    notification: persistedNotificationReducer, // Add your notification reducer
    chat: persistedChatReducer, // Add your chat reducer
    emergency: persistedEmergencyReducer, // Add your emergency reducer
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
