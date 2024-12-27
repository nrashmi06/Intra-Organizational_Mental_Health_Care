package com.dbms.mentalhealth.service;

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
    Page<BlogSummaryDTO> getBlogsByUser(Integer userId, Pageable pageable);
    Page<BlogSummaryDTO> searchBlogsByPartialTitle(String title, Integer userId, Pageable pageable);
    Page<BlogSummaryDTO> getBlogsByApprovalStatus(String status, Pageable pageable);
    Page<BlogSummaryDTO> getRecentBlogs(Integer userId, Pageable pageable);
    Page<BlogSummaryDTO> getMostViewedBlogs(Integer userId, Pageable pageable);
    Page<BlogSummaryDTO> getMostLikedBlogs(Integer userId, Pageable pageable);
    Page<BlogSummaryDTO> getTrendingBlogs(Integer userId, Pageable pageable);
    void incrementViewCountByAmount(Integer blogId, Integer amount);
}