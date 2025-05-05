// src/service/chat/chatBot.ts

import { chatBotURL } from '@/mapper/chatBotMapper';
import axiosInstance from '@/utils/axios';

// Define the structure of the expected API response
interface ChatHistoryEntry {
  role: 'user' | 'assistant';
  content: string;
  timestamp?: string;
}

interface ChatBotResponse {
  response: string;
  history?: ChatHistoryEntry[];
}

export const chatBot = async (
  message: string,
  sessionId: string = 'test-session-1111'
): Promise<ChatHistoryEntry | null> => {
  try {
    const requestBody = {
      model: 'local', // adjust based on your API
      prompt: message,
      session_id: sessionId,
      include_history: true,
      max_history: 15,
      stream: false,
      use_semantic_search: true,
      max_search_results: 3,
    };

    const response = await axiosInstance.post<ChatBotResponse>("https://acf9-125-22-23-98.ngrok-free.app/api/v1/chat", requestBody, { timeout: 5000000 });

    if (response?.data?.response) {
        
      return {
        role: 'assistant',
        content: response.data.response,
        timestamp: new Date().toISOString(), // or extract from `history`
      };
    } else {
      console.warn('Chatbot API returned empty response.');
      return null;
    }
  } catch (error: any) {
    console.error('Chatbot API error:', error?.message || error);
    return null;
  }
};
