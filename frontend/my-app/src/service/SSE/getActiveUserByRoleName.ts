import { SSE_API_ENDPOINTS } from "@/mapper/sseMapper";
import TokenManager from "@/utils/TokenManager";
import { store } from "@/store";

export const getActiveUserByRoleName = (
  type: string,
  token: string,
  onMessage: (data: any) => void,
  onError?: (error: Event) => void
) => {
  let currentToken = token;

  const connect = () => {
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

    const eventSource = new EventSource(
      `${url}?token=${encodeURIComponent(currentToken)}`
    );

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
        onMessage(data);
      } catch (error) {
        console.error(`Error parsing ${eventName} details:`, error);
      }
    });

    eventSource.onerror = async (error: any) => {

      if (error?.status === 401 || error.message?.includes("401")) {
        console.info("Unauthorized. Attempting to refresh token...");

        try {
          await TokenManager.triggerRefresh();
          const refreshedData = store.getState().auth;

          if (refreshedData?.accessToken) {
            currentToken = refreshedData.accessToken;
            eventSource.close(); 
            connect(); 
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

    return eventSource;
  };

  return connect();
};
