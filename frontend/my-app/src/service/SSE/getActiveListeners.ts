import { SSE_API_ENDPOINTS } from '@/mapper/sseMapper'; // Adjust the path as needed

interface ListenerDetails {
  userId: string;
  anonymousName: string;
}

export const getActiveListeners = (
  token: string,
  onMessage: (data: any) => void
) => {
  const eventSource = new EventSource(
    `${SSE_API_ENDPOINTS.SSE_ONLINE_LISTENERS}?token=${encodeURIComponent(token)}`
  );

  eventSource.onopen = () => {
    console.log("SSE connection opened.");
  };

  // Handle custom event type: "listenerDetails"
  eventSource.addEventListener("listenerDetails", (event) => {
    try {
      const data: ListenerDetails[] = JSON.parse(event.data);
      console.log("Received listener details:", data);
      onMessage(data);
    } catch (error) {
      console.error("Error parsing listener details:", error);
    }
  });

  eventSource.onerror = (error) => {
    console.error("SSE error:", error);
    eventSource.close(); // Close the connection on persistent error
  };

  return eventSource;
};
