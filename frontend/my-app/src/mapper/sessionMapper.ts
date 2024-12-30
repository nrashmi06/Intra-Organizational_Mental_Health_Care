// src/mapper/sessionMapper.ts

const BASE_API = `${process.env.NEXT_PUBLIC_BACKEND_URL}/mental-health/api/v1/sessions`;

export const SESSION_API_ENDPOINTS = {
  INITIATE_SESSION: (listenerId: string) => `${BASE_API}/initiate/${listenerId}`,
  UPDATE_SESSION_STATUS: (userId: string) => `${BASE_API}/status/${userId}`,
  END_SESSION: (sessionId: string) => `${BASE_API}/end/${sessionId}`,
  GET_SESSION_BY_ID: (sessionId: string) => `${BASE_API}/${sessionId}`,
  GET_SESSIONS_BY_USER_ID_OR_LISTENER_ID: (userId: string) =>
    `${BASE_API}/user/${userId}`,
  GET_SESSIONS_BY_STATUS: `${BASE_API}/filter`,
  GET_ALL_SESSIONS: BASE_API,
  GET_MESSAGES_BY_SESSION_ID: (sessionId: string) => `${BASE_API}/messages/${sessionId}`,
  AVG_SESSION_DURATION: `${BASE_API}/avg-duration`,
  GET_SESSIONS_BY_LISTENERS_USER_ID: (userId: string) =>
    `${BASE_API}/listener/${userId}`,
};
