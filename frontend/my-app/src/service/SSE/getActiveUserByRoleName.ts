interface ListenerDetails {
  userId: string;
  anonymousName: string;
}

export const getActiveUserByRoleName = (
  type: string,
  token: string,
  onMessage: (data: ListenerDetails[]) => void,
  onError?: (error: Event) => void
) => {
  const eventSource = new EventSource(
    `http://localhost:8080/mental-health/api/v1/sse/${type}?token=${encodeURIComponent(
      token
    )}`
  );

  const eventNameMap: Record<string, string> = {
    onlineUsers: "userDetails",
    onlineAdmins: "adminDetails",
    onlineListeners: "listenerDetails",
  };

  const eventName = eventNameMap[type];

  if (!eventName) {
    console.error("Unknown type:", type);
    eventSource.close();
    return null;
  }

  eventSource.onopen = () => {
    console.log(`SSE connection opened for ${type}`);
  };

  eventSource.addEventListener(eventName, (event) => {
    try {
      const data: ListenerDetails[] = JSON.parse(event.data);
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
