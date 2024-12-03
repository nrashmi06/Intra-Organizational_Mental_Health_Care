export const getActiveListeners = (
  token: string,
  onMessage: (data: any) => void
) => {
  // Initialize EventSource and pass the token as a query parameter
  const eventSource = new EventSource(
    `http://localhost:8080/mental-health/api/v1/sse/onlineListeners?token=${token}`
  );

  // Handle the connection opening
  eventSource.onopen = () => {
    console.log("SSE connection opened.");
  };

  // Handle incoming messages
  eventSource.onmessage = (event) => {
    try {
      const data = JSON.parse(event.data);
      console.log("Online listeners:", data);
      onMessage(data);
    } catch (error) {
      console.error("Error parsing online listeners message:", error);
    }
  };

  // Handle errors in the EventSource connection
  eventSource.onerror = (error) => {
    console.error("SSE error:", error);

    // If error is a `Event` object, log more details
    if (error instanceof Event) {
      console.error("EventSource error details: ", {
        type: error.type,
      });
    } else {
      console.error("Unexpected error:", error);
    }

    // Close the EventSource on error
    eventSource.close();
  };

  return eventSource;
};
