// src/service/notifications/subscribeToNotifications.ts
import { NOTIFICATION_API_ENDPOINTS } from "@/mapper/notificationMapper"; // Import from the mapper file
export const subscribeToNotifications = (
  token: string,
  userId: number,
  onNotificationReceived: (message: string, senderId: string) => void
) => {
  const eventSource = new EventSource(
    NOTIFICATION_API_ENDPOINTS.SUBSCRIBE_TO_NOTIFICATIONS(userId) +
      `&token=${encodeURIComponent(token)}`
  );

  eventSource.addEventListener("notification", (event) => {
    try {
      const eventData = event.data.trim(); // Remove unnecessary spaces
      console.log("Raw event data received:", eventData);

      // Check if the eventData is in valid JSON format
      if (eventData.startsWith("{") && eventData.endsWith("}")) {
        // Parse the message and senderId if it's valid JSON
        const { message, senderId } = JSON.parse(eventData);
        console.log("Parsed notification:", message, senderId);

        if (message && senderId) {
          onNotificationReceived(message, senderId); // Pass both message and senderId to the callback
        }
      } else {
        // Handle non-JSON message (e.g., "Connected")
        console.warn("Received non-JSON message:", eventData);
      }
    } catch (error) {
      console.error("Error parsing notification message:", error);
    }
  });

  eventSource.onerror = (error) => {
    console.error("SSE error:", error);
    eventSource.close();
  };

  return eventSource;
};
