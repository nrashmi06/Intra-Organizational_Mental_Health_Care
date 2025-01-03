import { SSE_API_ENDPOINTS } from '@/mapper/sseMapper';
import { store } from '@/store';
import TokenManager from '@/utils/TokenManager';

interface UserDetails {
  userId: string;
  anonymousName: string;
}

export const getAllSSE = (
  token: string,
  onMessage: (data: any) => void,
  onError?: (error: any) => void
) => {
  let currentToken = token;

  const createEventSource = (): EventSource => {
    const url = `${SSE_API_ENDPOINTS.SSE_ALL_ONLINE_USERS}?token=${encodeURIComponent(
      currentToken
    )}`;
    return new EventSource(url);
  };

  let eventSource = createEventSource();

  const setupListeners = () => {
    eventSource.onopen = () => {
      console.log("SSE connection opened.");
    };

    eventSource.addEventListener("allUsers", (event) => {
      try {
        const data: UserDetails[] = JSON.parse(event.data);
        console.log("Received user details:", data);
        onMessage(data);
      } catch (error) {
        console.error("Error parsing user details message:", error);
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
            eventSource.close(); 
            eventSource = createEventSource(); 
            setupListeners(); 
          } else {
            console.error("Token refresh failed. Redirecting to login.");
          }
        } catch (refreshError) {
          console.error("Error during token refresh:", refreshError);
          alert("Error refreshing token. Please log in again.");
        }
      } else {
        eventSource.close();
        if (onError) onError(error);
      }
    };
  };

  setupListeners(); 

  return eventSource;
};
