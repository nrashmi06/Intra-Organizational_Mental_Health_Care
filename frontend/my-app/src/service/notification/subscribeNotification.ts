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
        const eventData = event.data.trim(); // Remove unnecessary spaces
        console.log("Raw event data received:", eventData);

        if (eventData.startsWith("{") && eventData.endsWith("}")) {
          const { message, senderId } = JSON.parse(eventData);
          console.log("Parsed notification:", message, senderId);

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

      // Handle 401 Unauthorized (Token Expired)
      if (error?.status === 401 || error.message?.includes("401")) {
        console.info("Unauthorized. Attempting to refresh token...");

        try {
          await TokenManager.triggerRefresh();
          const refreshedData = store.getState().auth;

          if (refreshedData?.accessToken) {
            currentToken = refreshedData.accessToken; // Update the token
            console.log("Token refreshed. Reconnecting SSE...");
            eventSource.close(); // Close the current connection
            eventSource = createEventSource(); // Recreate the connection with the refreshed token
            setupListeners(); // Reattach event listeners
          } else {
            console.error("Token refresh failed. Redirecting to login.");
            alert("Session expired. Please log in again.");
            window.location.href = "/signin"; // Redirect to login
          }
        } catch (refreshError) {
          console.error("Error during token refresh:", refreshError);
          alert("Error refreshing token. Please log in again.");
          window.location.href = "/signin"; // Redirect to login
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
