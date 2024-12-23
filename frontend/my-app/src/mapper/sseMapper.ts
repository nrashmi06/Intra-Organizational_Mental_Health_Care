const BASE_API = `${process.env.NEXT_PUBLIC_BACKEND_URL}/mental-health/api/v1/sse`;

export const SSE_API_ENDPOINTS = {
  SSE_ALL_ONLINE_USERS: `${BASE_API}/allOnlineUsers`, // Get all online users
  SSE_ONLINE_USERS_COUNT_BY_ROLE: `${BASE_API}/onlineUsersByRole`, // Get online users count by role (for admins)
  SSE_ONLINE_LISTENERS: `${BASE_API}/onlineListeners`, // Get all online listeners
  SSE_ONLINE_ADMINS: `${BASE_API}/onlineAdmins`, // Get all online admins
  SSE_ONLINE_USERS: `${BASE_API}/onlineUsers`, // Get all online users
  HEARTBEAT: `${BASE_API}/heartbeat`, // Heartbeat endpoint to keep the connection alive
};

export default SSE_API_ENDPOINTS;
