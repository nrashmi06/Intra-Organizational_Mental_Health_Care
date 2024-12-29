import { configureStore } from '@reduxjs/toolkit';
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session'; // Using sessionStorage for persistence

import authReducer from './authSlice'; // Auth reducer
import notificationReducer from './notificationSlice'; // Notification reducer
import chatReducer from './chatSlice'; // Chat reducer
import eventSourceReducer from './eventsourceSlice'; // EventSource reducer

// Define individual persist configs
const authPersistConfig = {
  key: 'auth', // Key for auth storage
  storage,     // Using sessionStorage
};

const notificationPersistConfig = {
  key: 'notifications', // Key for notification storage
  storage,              // Using sessionStorage
};

const chatPersistConfig = {
  key: 'chat', // Key for chat storage
  storage,     // Using sessionStorage
};

const eventSourcePersistConfig = {
  key: 'eventSource', // Key for eventSource storage
  storage,            // Using sessionStorage
};

// Persist reducers
const persistedAuthReducer = persistReducer(authPersistConfig, authReducer);
const persistedNotificationReducer = persistReducer(notificationPersistConfig, notificationReducer);
const persistedChatReducer = persistReducer(chatPersistConfig, chatReducer);
const persistedEventSourceReducer = persistReducer(eventSourcePersistConfig, eventSourceReducer);

// Create the Redux store
const store = configureStore({
  reducer: {
    auth: persistedAuthReducer,         // Persisted auth reducer
    notification: persistedNotificationReducer, // Persisted notification reducer
    chat: persistedChatReducer,         // Persisted chat reducer
    eventSource: persistedEventSourceReducer,    // EventSource reducer (not persisted)
  },
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in development mode only
});

// Create the persistor
const persistor = persistStore(store);

// Export the store and persistor
export { store, persistor };

// Type definitions for convenience in TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
