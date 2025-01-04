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
      onMessage(data);
    } catch (error) {
      console.error("Error parsing active sessions:", error);
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
          console.log("Token refreshed. Reconnecting SSE...");
          eventSource.close();
          getActiveSessions(currentToken, onMessage);
        } else {
          console.error("Token refresh failed. Redirecting to login.");
        }
      } catch (refreshError) {
        console.error("Error during token refresh:", refreshError);
      }
    } else {
      eventSource.close(); 
    }
  };

  return eventSource;
};
