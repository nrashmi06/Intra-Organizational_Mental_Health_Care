import { SSE_API_ENDPOINTS } from '@/mapper/sseMapper';
import { store } from '@/store';
import TokenManager from '@/utils/TokenManager';

interface UserDetails {
  userId: string;
  anonymousName: string;
}

export const getAllSSEbyRole = (
  token: string,
  onMessage: (data: any) => void,
  onError?: (error: any) => void
) => {
  let currentToken = token;

  const createEventSource = (): EventSource => {
    const url = `${SSE_API_ENDPOINTS.SSE_ONLINE_USERS_COUNT_BY_ROLE}?token=${encodeURIComponent(
      currentToken
    )}`;
    return new EventSource(url);
  };

  let eventSource = createEventSource();

  const setupListeners = () => {
    eventSource.onopen = () => {
      console.log("SSE connection opened.");
    };

    eventSource.addEventListener("roleCounts", (event) => {
      try {
        const data: UserDetails[] = JSON.parse(event.data);
        onMessage(data);
      } catch (error) {
        console.error("Error parsing user details message:", error);
      }
    });

    eventSource.onerror = async (error: any) => {
      if (error?.status === 401 || error.status === 500 || error.message?.includes("Network Error")) {
        console.info("Unauthorized. Attempting to refresh token...");

        try {
          await TokenManager.triggerRefresh();
          const refreshedData = store.getState().auth;

          if (refreshedData?.accessToken) {
            currentToken = refreshedData.accessToken; 
            eventSource.close();
            eventSource = createEventSource(); 
            setupListeners();
          } else {
            console.error("Token refresh failed. Redirecting to login.");
          }
        } catch (refreshError) {
          console.error("Error during token refresh:", refreshError);
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
