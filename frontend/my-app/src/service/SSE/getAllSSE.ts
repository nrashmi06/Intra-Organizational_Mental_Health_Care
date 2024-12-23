import { SSE_API_ENDPOINTS } from '@/mapper/sseMapper'; 

interface UserDetails {
  userId: string;
  anonymousName: string;
}

export const getAllSSE = (token: string, onMessage: (data: any) => void) => {
  const url = `${SSE_API_ENDPOINTS.SSE_ALL_ONLINE_USERS}?token=${encodeURIComponent(token)}`;

  const eventSource = new EventSource(url);

  eventSource.onopen = () => {
    console.log("SSE connection opened.");
  };

  // Handle custom event type: "allUsers"
  eventSource.addEventListener("allUsers", (event) => {
    try {
      const data: UserDetails[] = JSON.parse(event.data);
      console.log("Received user details:", data);
      onMessage(data);
    } catch (error) {
      console.error("Error parsing user details message:", error);
    }
  });

  eventSource.onerror = (error) => {
    console.error("SSE error:", error);
    eventSource.close(); 
  };

  return eventSource;
};
