import { SESSION_API_ENDPOINTS } from "@/mapper/sessionMapper";

export const getSessionsByCategory = async (category: string , token:string) => {
  const API_URL = SESSION_API_ENDPOINTS.GET_SESSION_BY_CATEGORY(category);

  try {
    const response = await fetch(API_URL, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
        return [];
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching sessions:', error);
    return [];
  }
};
