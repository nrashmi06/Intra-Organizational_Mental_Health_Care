const BASE_API = `${process.env.NEXT_PUBLIC_BACKEND_URL}/mental-health/api/v1/sse`;

export const SSE_API_ENDPOINTS = {
  SSE_ALL_ONLINE_USERS: `${BASE_API}/allOnlineUsers`,
  SSE_ONLINE_USERS_COUNT_BY_ROLE: `${BASE_API}/onlineUsersByRole`, 
  SSE_ONLINE_LISTENERS: `${BASE_API}/onlineListeners`, 
  SSE_ONLINE_ADMINS: `${BASE_API}/onlineAdmins`, 
  SSE_ONLINE_USERS: `${BASE_API}/onlineUsers`,
  SSE_ACTIVE_SESSIONS: `${BASE_API}/activeSessions`, 
  HEARTBEAT: `${BASE_API}/heartbeat`, 
};

export default SSE_API_ENDPOINTS;
