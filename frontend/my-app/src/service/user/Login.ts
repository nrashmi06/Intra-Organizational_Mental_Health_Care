import { setUser } from "@/store/authSlice";
import { AppDispatch } from "@/store/index";

export const loginUser = (email: string, password: string) => async (dispatch: AppDispatch) => {
  try {
    // API call to login
    const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_URL}/mental-health/api/v1/users/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      credentials: "include", // Ensures cookies are included in the request
      body: JSON.stringify({ email, password }),
    });

    // Check for specific error status codes
    if (response.status === 401) {
      throw new Error("Invalid username or password. Please try again.");
    }
    if (response.status === 400) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Invalid input. Please check your credentials.");
    }
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed due to an unknown error.");
    }

    const data = await response.json();

    // Extract the access token from the Authorization header
    const authHeader = response.headers.get("authorization");
    const accessToken = authHeader?.startsWith("Bearer ")
      ? authHeader.slice(7) // Remove "Bearer " prefix
      : null;

    if (!accessToken) {
      throw new Error("Access token is missing from the response headers.");
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

    // Return the response data for further processing
    return { data, accessToken };
  } catch (error) {
    console.error("Login error:", error);

    // Re-throw the error for the calling component to handle
    if (error instanceof Error) {
      throw new Error(error.message || "Login failed.");
    }

    throw error;
  }
};
