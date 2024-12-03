export const getAverageSessionDetails = async (token: string) => {
  try {
    const response = await fetch(
      "http://localhost:8080/mental-health/api/v1/sessions/avg-duration",
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );
    console.log("Average sessionnnnnnnnn summary:", response);
    return response.json();
  } catch (error) {
    console.error("Error fetching session feedback summary:", error);
    throw error;
  }
};
