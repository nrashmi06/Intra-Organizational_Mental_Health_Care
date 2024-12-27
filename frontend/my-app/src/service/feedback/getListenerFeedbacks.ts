// fetch all the feedbacks of a listener using the listener userid

import axios from 'axios';
import { FEEDBACK_API_ENDPOINTS } from '@/mapper/feedbackMapper';
import { ListenerFeedback } from '@/lib/types';

export const getListenerFeedbacks = async (listenerId: string, accessToken: string): Promise<ListenerFeedback[]> => {
  try {
    const response = await axios.get<ListenerFeedback[]>(FEEDBACK_API_ENDPOINTS.GET_ALL_LISTNER_FEEDBCK(listenerId), {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching listener feedbacks:', error);
    throw error;
  }
};