import { setUser } from "@/store/authSlice";
import { AppDispatch } from "@/store/index";
import axiosInstance from "@/utils/axios"; // Import your Axios instance
import { API_ENDPOINTS } from "@/mapper/userMapper";

export const loginUser =
  (email: string, password: string) => async (dispatch: AppDispatch) => {
    try {
      interface LoginResponseData {
        userId: string;
        email: string;
        anonymousName: string;
        role: string;
      }

      const response = await axiosInstance.post<LoginResponseData>(
        API_ENDPOINTS.LOGIN,
        { email, password },
        {
          headers: { "Content-Type": "application/json" },
          validateStatus: (status) => status >= 200 && status < 500,
          withCredentials: true,
        }
      );

      const accessToken = response.headers["authorization"]?.startsWith(
        "Bearer "
      )
        ? response.headers["authorization"].slice(7)
        : null;

      if (response.status === 401) {
        return {
          success: false,
          error: "Wrong credentials. Please try again.",
        };
      } else if (response.status === 403) {
        return {
          success: false,
          error: "Please verify your email address and try again.",
        };
      }

      dispatch(
        setUser({
          userId: response.data.userId,
          email: response.data.email,
          anonymousName: response.data.anonymousName,
          role: response.data.role,
          accessToken: accessToken,
        })
      );

      return { success: true, data: response.data, accessToken };
    } catch (error: any) {
      console.error("Login error:", error);

      if (error.response) {
        if (error.response.status === 401) {
          return {
            success: false,
            error: "Invalid username or password. Please try again.",
          };
        }

        if (error.response.status === 400) {
          const errorData = error.response.data;
          return {
            success: false,
            error:
              errorData.message ||
              "Invalid input. Please check your credentials.",
          };
        }

        return {
          success: false,
          error:
            error.response.data?.message ||
            "Login failed due to an unknown error.",
        };
      }

      return {
        success: false,
        error: "Unable to connect to the server. Please try again later.",
      };
    }
  };