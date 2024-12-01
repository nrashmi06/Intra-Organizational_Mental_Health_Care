import axios from 'axios';

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
  } catch (error) {
    console.error("Error fetching admin profile:", error);
    throw error;
  }
};
