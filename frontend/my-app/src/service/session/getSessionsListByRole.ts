//get all the sessions of a role using the role id

export const getSessionListByRole = async (
  id: number,
  role: string,
  token: string
) => {
  try {
    const response = await fetch(
      `http://localhost:8080/mental-health/api/v1/sessions/user/${id}?role=${role}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    console.log("Listener sessions response:", response);
    const data = response;
    return data;
  } catch (error) {
    console.error("Error fetching listener sessions:", error);
  }
};
