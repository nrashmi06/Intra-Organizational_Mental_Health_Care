// blogMapper.js

const BASE_API = `${process.env.NEXT_PUBLIC_BACKEND_URL}/mental-health/api/v1/blogs`;

export const BLOG_API_ENDPOINTS = {
  CREATE_BLOG: `${BASE_API}/create`, // Create a new blog
  GET_BLOG_BY_ID: (blogId : number) => `${BASE_API}/${blogId}`, // Get blog by ID
  UPDATE_BLOG: (blogId : number) => `${BASE_API}/${blogId}`, // Update blog details
  DELETE_BLOG: (blogId : number) => `${BASE_API}/${blogId}`, // Delete blog
  LIKE_UNLIKE_BLOG: (blogId : number) => `${BASE_API}/${blogId}/like-unlike`, // Like or Unlike a blog
  UPDATE_BLOG_APPROVAL_STATUS: (blogId : number) => `${BASE_API}/${blogId}/approval-status`, // Update blog approval status
  GET_BLOGS_BY_APPROVAL_STATUS: `${BASE_API}`, // Get all blogs by approval status
  GET_BLOGS_BY_USER: (userId : string) => `${BASE_API}/user/${userId}`, // Get all blogs by user
  SEARCH_BLOGS_BY_PARTIAL_TITLE: `${BASE_API}/search/title`, // Search blogs by partial title
};
