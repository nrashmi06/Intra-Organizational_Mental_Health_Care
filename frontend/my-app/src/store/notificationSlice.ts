import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  message: string;
  senderId: string;
  sessionID?: string; // Optional session ID
}

interface NotificationState {
  notifications: Notification[];
}

const initialState: NotificationState = {
  notifications: [],
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    // Adds a new notification, ensuring no duplicates by senderId
    setNotification: (state, action: PayloadAction<Notification>) => {
      // Check if the notification already exists by senderId
      const existingNotification = state.notifications.find(
        (notif) => notif.senderId === action.payload.senderId
      );
      
      // If no existing notification, push the new one
      if (!existingNotification) {
        state.notifications.push(action.payload);
      }
    },
    // Clears all notifications
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { setNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
