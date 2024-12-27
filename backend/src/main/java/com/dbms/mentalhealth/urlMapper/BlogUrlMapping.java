package com.dbms.mentalhealth.urlMapper;

public class BlogUrlMapping {

    private BlogUrlMapping() {
        throw new IllegalStateException("Utility class");
    }
    private static final String BASE_API = "/api/v1/blogs";
    private static final String BLOG_ID_PATH = "/{blogId}"; // Placeholder for blogId

    // Blog creation and retrieval
    public static final String CREATE_BLOG = BASE_API + "/create"; // Create a new blog
    public static final String GET_BLOG_BY_ID = BASE_API + BLOG_ID_PATH; // Get blog by ID
    // Blog update and deletion
    public static final String UPDATE_BLOG = BASE_API + BLOG_ID_PATH; // Update blog details
    public static final String DELETE_BLOG = BASE_API + BLOG_ID_PATH; // Delete blog
    // Blog interactions
    public static final String LIKE_UNLIKE_BLOG = BASE_API + BLOG_ID_PATH + "/like-unlike"; // Like or Unlike a blog
    // Blog approval status
    public static final String UPDATE_BLOG_APPROVAL_STATUS = BASE_API + BLOG_ID_PATH + "/approval-status"; // Update blog approval status
    // Blog retrieval by approval status
    public static final String GET_BLOGS_BY_APPROVAL_STATUS = BASE_API;
    // Blog retrieval by user
    public static final String FILTER_BLOGS = BASE_API +"/filter"; // Get all blogs by user
    // Blog search
    public static final String SEARCH_BLOGS_BY_PARTIAL_TITLE = BASE_API + "/search/title"; //

    public static final String GET_TRENDING_BLOGS =  BASE_API + "/trending";// Search blogs by partial title
}