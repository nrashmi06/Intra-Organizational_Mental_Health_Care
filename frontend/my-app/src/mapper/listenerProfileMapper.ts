const BASE_API = `${process.env.NEXT_PUBLIC_BACKEND_URL}/mental-health/api/v1/listeners`;

export const LISTENER_API_ENDPOINTS = {
  GET_LISTENER_BY_ID_OR_TYPE: (type : string, id : string) => `${BASE_API}/details?type=${type}&id=${id}`, // Get Listener by User ID or type
  GET_ALL_LISTENERS_BY_STATUS: `${BASE_API}/all`, // Get all Listeners by profile status
  SUSPEND_OR_UNSUSPEND_LISTENER: (listenerId : string, action : string) => `${BASE_API}/suspend/${listenerId}?action=${action}`, // Suspend or unsuspend Listener
};
