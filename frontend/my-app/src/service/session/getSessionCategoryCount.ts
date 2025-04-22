// src/services/sessionService.ts

import { SESSION_API_ENDPOINTS } from "@/mapper/sessionMapper";

export interface SessionCategoryCount {
  stressCount: number;
  depressionCount: number;
  suicidalCount: number;
  breakupCount: number;
  anxietyCount: number;
  griefCount: number;
  traumaCount: number;
  relationshipIssuesCount: number;
  selfEsteemCount: number;
  otherCount: number;
}

export const fetchSessionCategoryCount = async (token : string): Promise<SessionCategoryCount> => {
  try {
    const response = await fetch(SESSION_API_ENDPOINTS.GET_SESSION_CATEGORY_COUNT, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        "authorization": `Bearer ${token}`,
      },
      credentials: "include", // if you're using cookies/auth
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch session category count: ${response.status}`);
    }

    const data: SessionCategoryCount = await response.json();
    return data;
  } catch (error) {
    console.error("Error fetching session category count", error);
    throw error;
  }
};
