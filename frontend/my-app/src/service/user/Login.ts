import { setUser } from "@/store/authSlice";
import { AppDispatch } from "@/store/index";
import { API_ENDPOINTS } from "@/mapper/userMapper";

export const loginUser = (email: string, password: string) => async (dispatch: AppDispatch) => {
  try {
    const response = await fetch(API_ENDPOINTS.LOGIN, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include",
      body: JSON.stringify({ email, password }),
    });

    // Handle different status codes by returning error information
    if (response.status === 401) {
      return { success: false, error: "Invalid username or password. Please try again." };
    }

    if (response.status === 400) {
      const errorData = await response.json();
      return { 
        success: false, 
        error: errorData.message || "Invalid input. Please check your credentials." 
      };
    }

    if (!response.ok) {
      const errorData = await response.json();
      return { 
        success: false, 
        error: errorData.message || "Login failed due to an unknown error." 
      };
    }

    const data = await response.json();

    const authHeader = response.headers.get("authorization");
    const accessToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7)
      : null;

    if (!accessToken) {
      return { 
        success: false, 
        error: "Authentication failed. Please try again." 
      };
    }

    // Dispatch the action to store user details and token in Redux
    dispatch(
      setUser({
        userId: data.userId,
        email: data.email,
        anonymousName: data.anonymousName,
        role: data.role,
        accessToken: accessToken,
      })
    );

    return { success: true, data, accessToken };
  } catch (error) {
    console.error("Login error:", error);
    return { 
      success: false, 
      error: "Unable to connect to the server. Please try again later." 
    };
  }
};