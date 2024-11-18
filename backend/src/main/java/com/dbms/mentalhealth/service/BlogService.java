package com.dbms.mentalhealth.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.dbms.mentalhealth.dto.blog.request.BlogRequestDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogResponseDTO;
import com.dbms.mentalhealth.enums.ApprovalStatus;
import com.dbms.mentalhealth.mapper.BlogMapper;
import com.dbms.mentalhealth.model.Blog;
import com.dbms.mentalhealth.repository.BlogLikeRepository;
import com.dbms.mentalhealth.repository.BlogRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.Optional;

@Service
public class BlogService {

    private final BlogRepository blogRepository;
    private final BlogLikeRepository blogLikeRepository;
    private final UserService userService;
    private final Cloudinary cloudinary;
    private static final Logger logger = LoggerFactory.getLogger(BlogService.class);
    @Autowired
    public BlogService(BlogRepository blogRepository, BlogLikeRepository blogLikeRepository, UserService userService, Cloudinary cloudinary) {
        this.blogRepository = blogRepository;
        this.blogLikeRepository = blogLikeRepository;
        this.userService = userService;
        this.cloudinary = cloudinary;
    }

    public BlogResponseDTO createBlog(BlogRequestDTO blogRequestDTO, MultipartFile image) {
        Blog blog = BlogMapper.toEntity(blogRequestDTO);
        if (image != null && !image.isEmpty()) {
            String imageUrl = saveImage(image);
            blog.setImageUrl(imageUrl);
        }
        if (blog.getApprovalStatus() == null) {
            blog.setApprovalStatus(ApprovalStatus.PENDING);
        }
        Blog createdBlog = blogRepository.save(blog);
        return BlogMapper.toResponseDTO(createdBlog);
    }


    public Optional<BlogResponseDTO> getBlogById(Integer blogId) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        Integer userId = userService.getUserIdByUsername(username);
        if (userId == null) {
            return Optional.empty();
        }
        boolean isAdmin = userService.isAdmin(userId);
//        logger.info("Current user ID: {}, isAdmin: {}", userId, isAdmin);

        return blogRepository.findById(blogId)
                .map(blog -> {
                    if (blog.getApprovalStatus() == ApprovalStatus.APPROVED || isAdmin) {
                        blog.setViewCount(blog.getViewCount() + 1);
                        blogRepository.save(blog);
                        return BlogMapper.toResponseDTO(blog);
                    }
                    return null;
                });
    }




    public BlogResponseDTO updateBlog(Integer blogId, BlogRequestDTO blogRequestDTO, MultipartFile image) {
        Blog blog = blogRepository.findById(blogId).orElseThrow(() -> new RuntimeException("Blog not found"));

        if (!isCurrentUserPublisher(blog.getUserId())) {
            throw new RuntimeException("You are not authorized to edit this blog");
        }
        if (image != null && !image.isEmpty()) {
            deleteImageFromCloudinary(blog.getImageUrl());
            String imageUrl = saveImage(image);
            blog.setImageUrl(imageUrl);
        }
        blog.setTitle(blogRequestDTO.getTitle());
        blog.setContent(blogRequestDTO.getContent());
        blog.setSummary(blogRequestDTO.getSummary());
        blog.setApprovalStatus(ApprovalStatus.PENDING);
        Blog updatedBlog = blogRepository.save(blog);
        return BlogMapper.toResponseDTO(updatedBlog);
    }

    private void deleteImageFromCloudinary(String imageUrl) {
        try {
            String publicId = extractPublicIdFromUrl(imageUrl);
            cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
        } catch (IOException e) {
            throw new RuntimeException("Failed to delete image from Cloudinary", e);
        }
    }

    private String extractPublicIdFromUrl(String imageUrl) {
        String[] parts = imageUrl.split("/");
        String publicIdWithExtension = parts[parts.length - 1];
        return publicIdWithExtension.split("\\.")[0];
    }

    public void deleteBlog(Integer blogId) {
        Blog blog = blogRepository.findById(blogId).orElseThrow(() -> new RuntimeException("Blog not found"));
        if (blog.getImageUrl() != null) {
            deleteImageFromCloudinary(blog.getImageUrl());
        }
        blogRepository.deleteById(blogId);
    }


    private boolean isCurrentUserPublisher(Integer blogUserId) {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        Integer currentUserId = userService.getUserIdByUsername(username);
        if (currentUserId == null) {
            return false;
        }
        return currentUserId.equals(blogUserId);
    }

    private String saveImage(MultipartFile image) {
        if (image == null || image.isEmpty()) {
            throw new IllegalArgumentException("Image file must not be null or empty");
        }
        try {
            Map<String, Object> uploadResult = cloudinary.uploader().upload(image.getBytes(), ObjectUtils.asMap(
                    "format", "jpg"
            ));
            return uploadResult.get("url").toString();
        } catch (IOException e) {
            throw new RuntimeException("Failed to upload image to Cloudinary", e);
        }
    }
    public BlogResponseDTO approveBlog(Integer blogId) {
        Blog blog = blogRepository.findById(blogId).orElseThrow(() -> new RuntimeException("Blog not found"));
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        String username;
        if (principal instanceof UserDetails) {
            username = ((UserDetails) principal).getUsername();
        } else {
            username = principal.toString();
        }
        Integer adminId = userService.getUserIdByUsername(username);
        blog.setApprovalStatus(ApprovalStatus.APPROVED);
        blog.setApprovedBy(adminId);
        blog.setPublishDate(LocalDateTime.now());
        Blog approvedBlog = blogRepository.save(blog);
        return BlogMapper.toResponseDTO(approvedBlog);
    }

    public BlogResponseDTO likeBlog(Integer blogId) {
        Blog blog = blogRepository.findById(blogId).orElseThrow(() -> new RuntimeException("Blog not found"));
        blog.setLikeCount(blog.getLikeCount() + 1);
        Blog likedBlog = blogRepository.save(blog);
        return BlogMapper.toResponseDTO(likedBlog);
    }

    public BlogResponseDTO unlikeBlog(Integer blogId) {
        Blog blog = blogRepository.findById(blogId).orElseThrow(() -> new RuntimeException("Blog not found"));
        blog.setLikeCount(blog.getLikeCount() - 1);
        Blog unlikedBlog = blogRepository.save(blog);
        return BlogMapper.toResponseDTO(unlikedBlog);
    }
}