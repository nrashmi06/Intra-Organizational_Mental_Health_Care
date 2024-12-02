export async function fetchAdmins(accessToken: string) {


  const response = await fetch("http://localhost:8080/mental-health/api/v1/admins", {
    method: "GET",
    headers: {
      "Authorization": `Bearer ${accessToken}`,
      "Content-Type": "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Error fetching admins: ${response.statusText}`);
  }

  return response.json();
}
