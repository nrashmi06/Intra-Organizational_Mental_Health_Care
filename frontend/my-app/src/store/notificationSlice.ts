import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  message: string;
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
    setNotification: (state, action: PayloadAction<Notification>) => {
      state.notifications.push(action.payload); // Push new message
    },
    clearNotifications: (state) => {
      state.notifications = [];
    },
  },
});

export const { setNotification, clearNotifications } = notificationSlice.actions;
export default notificationSlice.reducer;
