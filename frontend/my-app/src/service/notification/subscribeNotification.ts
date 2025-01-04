// src/service/notifications/subscribeToNotifications.ts
import { NOTIFICATION_API_ENDPOINTS } from "@/mapper/notificationMapper";
import { store } from "@/store";
import TokenManager from "@/utils/TokenManager";

export const subscribeToNotifications = (
  token: string,
  userId: number,
  onNotificationReceived: (message: string, senderId: string) => void,
  onError?: (error: any) => void
) => {
  let currentToken = token;

  const createEventSource = (): EventSource => {
    return new EventSource(
      NOTIFICATION_API_ENDPOINTS.SUBSCRIBE_TO_NOTIFICATIONS(userId) +
        `&token=${encodeURIComponent(currentToken)}`
    );
  };

  let eventSource = createEventSource();

  const setupListeners = () => {
    eventSource.addEventListener("notification", (event) => {
      try {
        const eventData = event.data.trim();

        if (eventData.startsWith("{") && eventData.endsWith("}")) {
          const { message, senderId } = JSON.parse(eventData);

          if (message && senderId) {
            onNotificationReceived(message, senderId); 
          }
        } else {
          console.warn("Received non-JSON message:", eventData);
        }
      } catch (error) {
        console.error("Error parsing notification message:", error);
      }
    });

    eventSource.onerror = async (error: any) => {
      console.error("SSE error:", error);

      if (error?.status === 401 || error.message?.includes("401")) {
        console.info("Unauthorized. Attempting to refresh token...");

        try {
          await TokenManager.triggerRefresh();
          const refreshedData = store.getState().auth;

          if (refreshedData?.accessToken) {
            currentToken = refreshedData.accessToken;
            eventSource.close(); 
            eventSource = createEventSource(); 
            setupListeners(); 
          } else {
            console.error("Token refresh failed. Redirecting to login.");
            window.location.href = "/signin";
          }
        } catch (refreshError) {
          console.error("Error during token refresh:", refreshError);
          window.location.href = "/signin"; 
        }
      } else {
        eventSource.close();
        if (onError) onError(error);
      }
    };
  };

  setupListeners(); 

  return eventSource;
};
