const BASE_API = `${process.env.NEXT_PUBLIC_BACKEND_URL}/mental-health/api/v1/session-feedback`;

export const FEEDBACK_API_ENDPOINTS = {
    CREATE_FEEDBACK: `${BASE_API}`, // Create a new feedback
    GET_FEEDBACK_BY_SESSION: (id: string) => `${BASE_API}/session/${id}`, // Get feedback by ID
    GET_ALL_FEEDBACK_BY_FEEDBACK_ID: (id: string) => `${BASE_API}/feedback/${id}`, // Get all feedback
    GET_ALL_LISTNER_FEEDBCK: (id: string) => `${BASE_API}/listener/${id}`, // Update feedback details
    GET_SUMMARY_FEEDBACK: `${BASE_API}/summary`, // Delete feedback
};