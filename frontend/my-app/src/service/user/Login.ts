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

    // Check if the response is OK (status code 200-299)
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || "Login failed.");
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

    // Log the response for debugging
    console.log("API Response:", data);
    console.log("Authorization Header:", authHeader);
    console.log("Access Token:", accessToken);

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
    return data;
  } catch (error) {
    console.error("Login error:", error);

    if (error instanceof Error) {
      throw new Error(error.message || "Login failed.");
    }

    throw error;
  }
};
