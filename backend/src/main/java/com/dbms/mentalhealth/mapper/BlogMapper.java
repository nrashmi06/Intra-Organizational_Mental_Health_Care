package com.dbms.mentalhealth.mapper;

import com.dbms.mentalhealth.dto.blog.request.BlogRequestDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogResponseDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogSummaryDTO;
import com.dbms.mentalhealth.model.Blog;
import org.springframework.web.multipart.MultipartFile;

public class BlogMapper {

    public static Blog toEntity(BlogRequestDTO blogRequestDTO) {
        Blog blog = new Blog();
        blog.setTitle(blogRequestDTO.getTitle());
        blog.setContent(blogRequestDTO.getContent());
        blog.setUserId(blogRequestDTO.getUserId());
        blog.setSummary(blogRequestDTO.getSummary());
        // Image URL will be set in the service layer after uploading to Cloudinary
        return blog;
    }

    public static BlogResponseDTO toResponseDTO(Blog blog,boolean likedByCurrentUser) {
        // Map Blog entity to BlogResponseDTO
        return new BlogResponseDTO(
                blog.getId(),
                blog.getTitle(),
                blog.getContent(),
                blog.getUserId(),
                blog.getImageUrl(),
                blog.getSummary(),
                blog.getPublishDate(),
                blog.getViewCount(),
                blog.getLikeCount(),
                blog.getCreatedAt(),
                blog.getUpdatedAt(),
                likedByCurrentUser
        );
    }
    public static BlogSummaryDTO toSummaryDTO(Blog blog, boolean likedByCurrentUser) {
        BlogSummaryDTO summaryDTO = new BlogSummaryDTO();
        summaryDTO.setId(blog.getId());
        summaryDTO.setTitle(blog.getTitle());
        summaryDTO.setSummary(blog.getSummary());
        summaryDTO.setLikeCount(blog.getLikeCount());
        summaryDTO.setLikedByCurrentUser(likedByCurrentUser);
        return summaryDTO;
    }
}