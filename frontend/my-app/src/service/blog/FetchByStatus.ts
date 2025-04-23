import axiosInstance from '@/utils/axios';
import { BLOG_API_ENDPOINTS } from '@/mapper/blogMapper';


export async function fetchByStatus(status: string, token: string, page?: number, size?: number) {
  if (!token) {
    throw new Error('No token found');
  }

  const headers = {
    'Authorization': `Bearer ${token}`,
    'Content-Type': 'application/json',
  };

  const params: Record<string, string | number> = {
    status: status || 'pending',
  };
  if (page !== undefined) {
    params.page = page;
  }
  if (size !== undefined) {
    params.size = size;
  }

  try {
    const response = await axiosInstance.get(BLOG_API_ENDPOINTS.GET_BLOGS_BY_APPROVAL_STATUS, {
      headers,
      params,
    });

    interface BlogResponse {
      content: any[];
      page: {
        number: number;
        size: number;
        totalElements: number;
        totalPages: number;
      };
    }

    const data: BlogResponse = response.data as BlogResponse;

    if (data && data.content && data.page) {
      const { content, page: pageInfo } = data;
      return {
        content,
        pageInfo, 
      };
    } else {
      console.error('Unexpected data structure:', data);
    }
  } catch (error : any) {
      console.error('Unexpected error:', error);
  }
}