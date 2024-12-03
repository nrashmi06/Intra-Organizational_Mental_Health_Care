import axios from 'axios';
// import error from 'next/error';

export const fetchAdminProfile = async (token: string) => {
  try {
    console.log("Fetching admin profile...");
    console.log("Token: ", token);
    const response = await axios.get(
      `http://localhost:8080/mental-health/api/v1/admins/profile`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: any) {
    if (error.response && error.response.status === 404) {
      console.warn("Profile not found (404). Returning null.");
      return null; // Explicitly handle 404
    }
    console.error("Error fetching admin profile:", error);
    throw error;
  }
};
