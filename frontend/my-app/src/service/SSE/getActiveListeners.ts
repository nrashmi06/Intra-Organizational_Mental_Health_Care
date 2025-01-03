import { SSE_API_ENDPOINTS } from "@/mapper/sseMapper"; 
import { store } from "@/store";
import TokenManager from "@/utils/TokenManager";

interface ListenerDetails {
  userId: string;
  anonymousName: string;
}

export const getActiveListeners = (token: string, onMessage: (data: any) => void) => {
  let currentToken = token;

  const eventSource = new EventSource(
    `${SSE_API_ENDPOINTS.SSE_ONLINE_LISTENERS}?token=${encodeURIComponent(currentToken)}`
  );

  eventSource.onopen = () => {
    console.log("SSE connection opened.");
  };

  eventSource.addEventListener("listenerDetails", (event) => {
    try {
      const data: ListenerDetails[] = JSON.parse(event.data);
      console.log("Received listener details:", data);
      onMessage(data);
    } catch (error) {
      console.error("Error parsing listener details:", error);
    }
  });

  eventSource.onerror = async (error: any) => {
    console.error("SSE error:", error);

    if (error.status === 401 || error.message?.includes("401")) {
      console.info("Unauthorized. Attempting to refresh token...");

      try {
        await TokenManager.triggerRefresh();
        const refreshedData = store.getState().auth;

        if (refreshedData?.accessToken) {
          currentToken = refreshedData.accessToken; 
          console.log("Token refreshed. Reconnecting SSE...");
          eventSource.close(); 
          new EventSource(
            `${SSE_API_ENDPOINTS.SSE_ONLINE_LISTENERS}?token=${encodeURIComponent(currentToken)}`
          );
        } else {
          console.error("Failed to refresh token. Logging out...");
          alert("Session expired. Please log in again.");
          window.location.href = "/signin"; // Redirect to login
        }
      } catch (refreshError) {
        console.error("Error during token refresh:", refreshError);
      }
    } else {
      eventSource.close(); // Close the connection on persistent error
    }
  };

  return eventSource;
};
