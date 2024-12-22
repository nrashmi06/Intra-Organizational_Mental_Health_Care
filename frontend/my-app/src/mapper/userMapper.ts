// envMapper.js

const BASE_API = `${process.env.NEXT_PUBLIC_BACKEND_URL}/mental-health/api/v1/users`;

export const API_ENDPOINTS = {
  REGISTER: `${BASE_API}/register`,
  LOGIN: `${BASE_API}/login`,
  LOGOUT: `${BASE_API}/logout`,
  VERIFY_EMAIL: `${BASE_API}/verify-email`,
  RESEND_VERIFICATION_EMAIL: `${BASE_API}/resend-verification-email`,
  RENEW_TOKEN: `${BASE_API}/renew-token`,
  GET_ALL_USERS_BY_PROFILE_STATUS: `${BASE_API}/all`,
  GET_USER_BY_ID: (userId: string) => `${BASE_API}/${userId}`,
  UPDATE_USER: (userId: string) => `${BASE_API}/${userId}`,
  DELETE_USER: (userId: string) => `${BASE_API}/${userId}`,
  SUSPEND_USER: (userId: string) => `${BASE_API}/suspend/${userId}`,
  CHANGE_PASSWORD: (userId: string) => `${BASE_API}/${userId}/change-password`,
  FORGOT_PASSWORD: `${BASE_API}/forgot-password`,
  RESET_PASSWORD: `${BASE_API}/reset-password`,
};
