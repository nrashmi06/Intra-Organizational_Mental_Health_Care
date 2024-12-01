import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/mental-health/api/v1';

export const updateBlog = async (
  id: number,
  blogData: {
    title?: string;
    content?: string;
    summary?: string;
    userId: number;
    image?: File;
  },
  token: string
) => {
  const formData = new FormData();

  if (blogData.image) {
    formData.append('image', blogData.image);
  }

  const blogRequestDTO = {
    title: blogData.title,
    content: blogData.content,
    summary: blogData.summary,
    userId: blogData.userId,
  };

  const blogBlob = new Blob([JSON.stringify(blogRequestDTO)], {
    type: 'application/json',
  });
  formData.append('blog', blogBlob, 'blog.json');

  const response = await axios.put(`${API_BASE_URL}/blogs/${id}`, formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
      Authorization: `Bearer ${token}`,
    },
  });

  return response.data;
};
