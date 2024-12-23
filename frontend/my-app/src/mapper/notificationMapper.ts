const BASE_API_URL = `${process.env.NEXT_PUBLIC_BACKEND_URL}/mental-health/api/v1`;

export const NOTIFICATION_API_ENDPOINTS = {
  SUBSCRIBE_TO_NOTIFICATIONS: (userId: number) =>
    `${BASE_API_URL}/sse/notifications/subscribe?userId=${userId}`,
};