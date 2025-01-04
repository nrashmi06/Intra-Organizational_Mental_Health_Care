package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.dto.blog.trending.TrendingBlogSummaryDTO;
import com.dbms.mentalhealth.dto.blog.request.BlogRequestDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogResponseDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogSummaryDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

public interface BlogService {
    BlogResponseDTO createBlog(BlogRequestDTO blogRequestDTO, MultipartFile image) throws Exception;
    Optional<BlogResponseDTO> getBlogById(Integer blogId);
    BlogResponseDTO updateBlog(Integer blogId, BlogRequestDTO blogRequestDTO, MultipartFile image) throws Exception;
    void deleteBlog(Integer blogId) throws Exception;
    BlogResponseDTO updateBlogApprovalStatus(Integer blogId, boolean isApproved);
    BlogResponseDTO likeBlog(Integer blogId);
    BlogResponseDTO unlikeBlog(Integer blogId);
    Page<BlogSummaryDTO> getBlogsByApprovalStatus(String status, Pageable pageable);
    Page<TrendingBlogSummaryDTO> getTrendingBlogs(Integer userId, String title, Pageable pageable);
    Page<BlogSummaryDTO> filterBlogs(Integer userId, String title,Pageable pageable);
}