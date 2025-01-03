import { SSE_API_ENDPOINTS } from "@/mapper/sseMapper";
import { store } from "@/store";
import { Session } from "@/lib/types";
import TokenManager from "@/utils/TokenManager";

export const getActiveSessions = (
  token: string,
  onMessage: (data: Session[]) => void
) => {
  let currentToken = token;

  const eventSource = new EventSource(
    `${SSE_API_ENDPOINTS.SSE_ACTIVE_SESSIONS}?token=${encodeURIComponent(currentToken)}`
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

  eventSource.onerror = async (error: any) => {
    console.error("SSE error:", error.message);

    // Handle 401 Unauthorized (Token Expired)
    if (error?.status === 401 || error.message?.includes("401")) {
      console.info("Unauthorized. Attempting to refresh token...");

      try {
        await TokenManager.triggerRefresh();
        const refreshedData = store.getState().auth;

        if (refreshedData?.accessToken) {
          currentToken = refreshedData.accessToken; // Update the token
          console.log("Token refreshed. Reconnecting SSE...");
          eventSource.close(); // Close the current connection
          getActiveSessions(currentToken, onMessage); // Reconnect with the new token
        } else {
          console.error("Token refresh failed. Redirecting to login.");
          alert("Session expired. Please log in again.");
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
