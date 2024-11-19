package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.dto.blog.request.BlogRequestDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogResponseDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogSummaryDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

public interface BlogService {
    BlogResponseDTO createBlog(BlogRequestDTO blogRequestDTO, MultipartFile image);
    Optional<BlogResponseDTO> getBlogById(Integer blogId);
    BlogResponseDTO updateBlog(Integer blogId, BlogRequestDTO blogRequestDTO, MultipartFile image);
    void deleteBlog(Integer blogId);
    BlogResponseDTO updateBlogApprovalStatus(Integer blogId, boolean isApproved);
    BlogResponseDTO likeBlog(Integer blogId);
    BlogResponseDTO unlikeBlog(Integer blogId);
    List<BlogSummaryDTO> getBlogsByUser(Integer userId);
    List<BlogSummaryDTO> searchBlogsByPartialTitle(String title);
    List<BlogSummaryDTO> getBlogsByApprovalStatus(String status);
}