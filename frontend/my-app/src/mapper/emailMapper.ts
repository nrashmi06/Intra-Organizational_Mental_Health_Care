const BASE_API = `${process.env.NEXT_PUBLIC_BACKEND_URL}/mental-health/api/v1`;

export const EMAIL_API_ENDPOINTS = {
  SEND_MASS_EMAIL: (recipientType: string) =>
    `${BASE_API}/email/mass?recipientType=${recipientType}`,
};