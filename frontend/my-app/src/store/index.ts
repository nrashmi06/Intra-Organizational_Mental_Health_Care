import { configureStore } from '@reduxjs/toolkit';
import authReducer from './authSlice'; // Your auth reducer
import { persistReducer, persistStore } from 'redux-persist';
import storage from 'redux-persist/lib/storage/session'; // Using sessionStorage

// Define the persist config
const persistConfig = {
  key: 'root',  // Key for storage
  storage,      // Using sessionStorage
};

// Persist the auth reducer (or other reducers)
const persistedReducer = persistReducer(persistConfig, authReducer);

// Create the Redux store
const store = configureStore({
  reducer: {
    auth: persistedReducer,  // Use the persisted reducer
  },
  devTools: process.env.NODE_ENV !== 'production', // Enable Redux DevTools in development
});

// Create the persistor for Redux Persist
const persistor = persistStore(store); // Type for persistor is already inferred from persistStore

// Export the store and persistor for use in _app.tsx
export { store, persistor };

// Type the RootState and AppDispatch for useSelector and useDispatch
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
