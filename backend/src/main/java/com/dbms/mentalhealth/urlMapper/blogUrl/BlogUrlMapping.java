package com.dbms.mentalhealth.urlMapper.blogUrl;


public class BlogUrlMapping {
    private static final String BASE_API = "/api/v1/blogs";
    private static final String BLOG_ID_PATH = "/{blogId}"; // Placeholder for blogId
    private static final String USER_ID_PATH = "/{userId}"; // Placeholder for userId

    //write, edit, delete, approve, search by tags
    public static final String CREATE_BLOG = BASE_API + "/create"; // Create a new blog
    public static final String GET_BLOG_BY_ID = BASE_API + BLOG_ID_PATH; // Get blog by ID
    public static final String UPDATE_BLOG = BASE_API + BLOG_ID_PATH; // Update blog details
    public static final String DELETE_BLOG = BASE_API + BLOG_ID_PATH; // Delete blog
    public static final String LIKE_BLOG = BASE_API + BLOG_ID_PATH + "/like"; // Like a blog
    public static final String UNLIKE_BLOG = BASE_API + BLOG_ID_PATH + "/unlike"; // Unlike a blog
    public static final String APPROVE_BLOG = BASE_API + BLOG_ID_PATH + "/approve"; // Approve blog
    public static final String GET_ALL_APPROVED_BLOGS = BASE_API + "/all"; // Get all blogs
    public static final String CHECK_LIKE_STATUS = BASE_API + BLOG_ID_PATH + "/likes" + USER_ID_PATH; // Check if blog is liked by user    public static final String APPROVE_BLOG = BASE_API + BLOG_ID_PATH + "/approve"; // Approve blog
    public static final String GET_BLOGS_BY_USER = BASE_API + "/user"; // Get all blogs by user
    public static final String SEARCH_BLOGS_BY_PARTIAL_TITLE = BASE_API + "/search/title";
}