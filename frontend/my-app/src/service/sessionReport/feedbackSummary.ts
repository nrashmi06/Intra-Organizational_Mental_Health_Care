import { REPORT_API_ENDPOINTS } from "@/mapper/reportMapper";

export const getSeverityAnalysis = async (token: string) => {
  try {
    const response = await fetch(REPORT_API_ENDPOINTS.GET_REPORT_SUMMARY, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    console.log("Session feedback summary:", response);
    return response;
  } catch (error) {
    console.error("Error fetching session feedback summary:", error);
    throw error;
  }
};
