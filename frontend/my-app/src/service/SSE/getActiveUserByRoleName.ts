interface ListenerDetails {
  userId: string;
  anonymousName: string;
}
export const getActiveUserByRoleName = (
  type: string,
  token: string,
  onMessage: (data: any) => void
) => {
  const eventSource = new EventSource(
    `http://localhost:8080/mental-health/api/v1/sse/${type}?token=${encodeURIComponent(
      token
    )}`
  );

  let eventName = "";
  switch (type) {
    case "onlineUsers":
      eventName = "userDetails";
      break;
    case "onlineAdmins":
      eventName = "adminDetails";
      break;
    case "onlineListeners":
      eventName = "listenerDetails";
      break;
    default:
      console.error("Unknown type:", type);
      eventSource.close();
      return;
  }
  eventSource.onopen = () => {
    console.log("SSE connection opened.");
  };

  // Handle custom event type: "listenerDetails"
  eventSource.addEventListener(eventName, (event) => {
    try {
      const data: ListenerDetails[] = JSON.parse(event.data);
      console.log(`Received ${eventName} details:`, data);
      onMessage(data);
    } catch (error) {
      console.error("Error parsing listener details:", error);
    }
  });

  eventSource.onerror = (error) => {
    console.error("ERORRRRRRRRRRRRRRRRRRR", error);
    eventSource.close(); // Close the connection on persistent error
  };

  return eventSource;
};
