interface UserDetails {
  userId: string;
  anonymousName: string;
}

export const getAllSSEbyRole = (
  token: string,
  onMessage: (data: any) => void
) => {
  const eventSource = new EventSource(
    `http://localhost:8080/mental-health/api/v1/sse/onlineUsersByRole?token=${encodeURIComponent(
      token
    )}`
  );

  eventSource.onopen = () => {
    console.log("SSE connection opened.");
  };

  // Handle custom event type: "userDetails"
  eventSource.addEventListener("roleCounts", (event) => {
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
    eventSource.close(); // Close the connection on persistent error
  };

  return eventSource;
};
