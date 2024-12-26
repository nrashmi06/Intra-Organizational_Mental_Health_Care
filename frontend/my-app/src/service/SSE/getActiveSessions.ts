import { SSE_API_ENDPOINTS } from '@/mapper/sseMapper'; 
import { Session } from '@/lib/types';

export const getActiveSessions = (
  token: string,
  onMessage: (data: Session[]) => void
) => {
  const eventSource = new EventSource(
    `${SSE_API_ENDPOINTS.SSE_ACTIVE_SESSIONS}?token=${encodeURIComponent(token)}`
  );

  eventSource.onopen = () => {
    console.log("SSE connection opened.");
  };

  eventSource.addEventListener("sessionDetails", (event) => {
    try {
      const data: Session[] = JSON.parse(event.data);
      console.log("Received active sessions:", data);
      onMessage(data);
    } catch (error) {
      console.error("Error parsing active sessions:", error);
    }
  });

  eventSource.onerror = (error) => {
    console.error("SSE error:", error);
    eventSource.close();
  };

  return eventSource;
};