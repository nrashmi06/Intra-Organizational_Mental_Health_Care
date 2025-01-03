import refreshToken from "@/service/user/RefreshToken";
import { store } from "@/store";
import { clearUser } from "@/store/authSlice";

class TokenManager {
  private static refreshPromise: Promise<string | null> | null = null;

  public static async getToken(): Promise<string | null> {
    const { accessToken } = store.getState().auth;
    return accessToken || null;
  }

  public static async refresh(): Promise<string | null> {
    if (this.refreshPromise) {
      console.log("Token refresh in progress. Returning existing promise.");
      return this.refreshPromise;
    }

    this.refreshPromise = (async () => {
      try {
        console.log("Refreshing token...");
        await refreshToken(store.dispatch);  // Call API to refresh token
        const { accessToken } = store.getState().auth;
        console.log("Token refreshed successfully.");
        return accessToken || null;
      } catch (error) {
        console.error("Error refreshing token:", error);
        store.dispatch(clearUser());
        window.location.href = "/signin"; 
        return null;
      } finally {
        this.refreshPromise = null;
      }
    })();

    return this.refreshPromise;
  }

  public static async triggerRefresh(): Promise<void> {
    try {
      const refreshedToken = await this.refresh();
      if (refreshedToken) {
        console.log("Token successfully refreshed:", refreshedToken);
      } else {
        console.warn("Token refresh failed. Redirecting to login...");
      }
    } catch (error) {
      console.error("Error triggering token refresh:", error);
    }
  }
}

export default TokenManager;
