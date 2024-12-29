import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface Notification {
  message: string;
  senderId: string;
  sessionID?: string;
}

interface NotificationState {
  visibleNotifications: Notification[];
  storedSessionRequest: Notification | null;
  isPopupVisible: boolean;
}

const initialState: NotificationState = {
  visibleNotifications: [],
  storedSessionRequest: null,
  isPopupVisible: true,
};

const isSessionRequest = (message: string) => {
  return message.includes("User ID:") && !message.includes("accepted") && 
         !message.includes("rejected") && !message.includes("ended");
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    setNotification: (state, action: PayloadAction<Notification>) => {
      const newNotification = action.payload;
      
      if (isSessionRequest(newNotification.message)) {
        // Check if we already have a stored request from this sender
        if (state.storedSessionRequest?.senderId === newNotification.senderId) {
          // Just make it visible again if it's the same sender
          state.visibleNotifications = [newNotification];
          state.isPopupVisible = true;
          return;
        }
        
        // If it's a new session request, store it
        state.storedSessionRequest = newNotification;
      }
      
      // Always show acceptance/rejection notifications
      if (newNotification.message.includes("accepted") || 
          newNotification.message.includes("rejected") ||
          newNotification.message.includes("Session starting soon")) {
        state.visibleNotifications = [newNotification];
        state.isPopupVisible = true;
      } else {
        // For other notifications
        state.visibleNotifications = [newNotification];
        state.isPopupVisible = true;
      }
    },
    clearNotifications: (state) => {
      state.visibleNotifications = [];
      state.storedSessionRequest = null;
      state.isPopupVisible = false;
    },
    hidePopup: (state) => {
      state.isPopupVisible = false;
    },
    showPopup: (state) => {
      if (state.storedSessionRequest || state.visibleNotifications.length > 0) {
        state.isPopupVisible = true;
      }
    },
    clearStoredRequest: (state) => {
      state.storedSessionRequest = null;
    }
  },
});

export const {
  setNotification,
  clearNotifications,
  hidePopup,
  showPopup,
  clearStoredRequest
} = notificationSlice.actions;

export default notificationSlice.reducer;