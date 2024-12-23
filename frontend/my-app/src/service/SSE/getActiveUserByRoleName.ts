import { SSE_API_ENDPOINTS } from '@/mapper/sseMapper'; 
export const getActiveUserByRoleName = (
  type: string,
  token: string,
  onMessage: (data: any) => void,
  onError?: (error: Event) => void
) => {
  const eventSourceUrlMap: Record<string, string> = {
    onlineUsers: SSE_API_ENDPOINTS.SSE_ONLINE_USERS, 
    onlineAdmins: SSE_API_ENDPOINTS.SSE_ONLINE_ADMINS, 
    onlineListeners: SSE_API_ENDPOINTS.SSE_ONLINE_LISTENERS, 
  };

  const url = eventSourceUrlMap[type];

  if (!url) {
    console.error("Unknown type:", type);
    return null;
  }

  const eventSource = new EventSource(`${url}?token=${encodeURIComponent(token)}`);

  const eventNameMap: Record<string, string> = {
    onlineUsers: "userDetails",
    onlineAdmins: "adminDetails",
    onlineListeners: "listenerDetails",
  };

  const eventName = eventNameMap[type];

  eventSource.onopen = () => {
    console.log(`SSE connection opened for ${type}`);
  };

  eventSource.addEventListener(eventName, (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log(`Received ${eventName} details:`, data);
      onMessage(data);
    } catch (error) {
      console.error(`Error parsing ${eventName} details:`, error);
    }
  });

  eventSource.onerror = (error) => {
    console.error(`SSE Connection Error for ${type}:`, error);
    if (onError) {
      onError(error);
    }
    eventSource.close();
  };

  return eventSource;
};
