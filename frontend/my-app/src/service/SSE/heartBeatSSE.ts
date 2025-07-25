import { SSE_API_ENDPOINTS } from "@/mapper/sseMapper"; // Assuming this is where the endpoint is stored
import { store } from "@/store";
import TokenManager from "@/utils/TokenManager";

export const subscribeToHeartbeat = (
  onHeartbeatReceived: (message: string) => void,
  onError?: (error: any) => void
) => {
  // Retrieve the current token
  let currentToken: string | null = store.getState().auth.accessToken;

  // Function to create the EventSource for heartbeat using SSE_API_ENDPOINTS
  const createEventSource = (): EventSource => {
    const url = new URL(SSE_API_ENDPOINTS.HEARTBEAT, window.location.origin); 
    url.searchParams.append("token", encodeURIComponent(currentToken!)); 
    return new EventSource(url.toString());
  };

  let eventSource = createEventSource();

  const setupListeners = () => {
    // Listen for the heartbeat message
    eventSource.onmessage = (event) => {
      try {
        const eventData = event.data.trim();
        onHeartbeatReceived(eventData);
      } catch (error) {
        console.error("Error handling heartbeat message:", error);
      }
    };

    eventSource.onerror = async (error: any) => {

      if (error?.status === 401 || error.message?.includes("401")) {
        console.info("Unauthorized. Attempting to refresh token...");

        try {
          await TokenManager.triggerRefresh();
          const refreshedData = store.getState().auth;

          if (refreshedData?.accessToken) {
            currentToken = refreshedData.accessToken;
            console.log("Token refreshed. Reconnecting heartbeat SSE...");
            eventSource.close(); 
            eventSource = createEventSource(); 
            setupListeners(); 
          } else {
            console.error("Token refresh failed. Redirecting to login.");
            window.location.href = "/signin"; 
          }
        } catch (refreshError) {
          console.error("Error during token refresh:", refreshError);
          window.location.href = "/signin"; 
        }
      } else {
        eventSource.close();
        if (onError) onError(error);
      }
    };
  };

  // Set up the listeners for the first time
  setupListeners();

  // Return the eventSource so that it can be closed if needed later
  return eventSource;
};
