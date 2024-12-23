import { ADMIN_PROFILE_API_ENDPOINTS } from "@/mapper/adminProfileMapper";

export async function fetchAdmins(accessToken: string) {

  const response = await fetch(ADMIN_PROFILE_API_ENDPOINTS.GET_ALL_ADMIN_PROFILE, {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching admins: ${response.statusText}`);
  }

  return response;
}
