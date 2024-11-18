package com.dbms.mentalhealth.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.dbms.mentalhealth.dto.blog.request.BlogRequestDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogResponseDTO;
import com.dbms.mentalhealth.enums.ApprovalStatus;
import com.dbms.mentalhealth.mapper.BlogMapper;
import com.dbms.mentalhealth.model.Blog;
import com.dbms.mentalhealth.model.BlogLike;
import com.dbms.mentalhealth.repository.BlogLikeRepository;
import com.dbms.mentalhealth.repository.BlogRepository;
import com.dbms.mentalhealth.repository.UserRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class BlogService {

    private final UserRepository userRepository;
    private final BlogRepository blogRepository;
    private final BlogLikeRepository blogLikeRepository;
    private final UserService userService;
    private final Cloudinary cloudinary;
//    private static final Logger logger = LoggerFactory.getLogger(BlogService.class);
    @Autowired
    public BlogService(UserRepository userRepository, BlogRepository blogRepository, BlogLikeRepository blogLikeRepository, UserService userService, Cloudinary cloudinary) {
        this.blogRepository = blogRepository;
        this.blogLikeRepository = blogLikeRepository;
        this.userService = userService;
        this.cloudinary = cloudinary;
        this.userRepository = userRepository;
    }

    @Transactional
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
        String username = getUsernameFromContext();
        Integer userId = userService.getUserIdByUsername(username);
        if (userId == null) {
            return Optional.empty();
        }
        boolean isAdmin = userService.isAdmin(userId);

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



    @Transactional
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

    @Transactional
    public void deleteBlog(Integer blogId) {
        Blog blog = blogRepository.findById(blogId).orElseThrow(() -> new RuntimeException("Blog not found"));
        if (blog.getImageUrl() != null) {
            deleteImageFromCloudinary(blog.getImageUrl());
        }
        blogRepository.deleteById(blogId);
    }


    private boolean isCurrentUserPublisher(Integer blogUserId) {
        String username = getUsernameFromContext();
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
    public BlogResponseDTO updateBlogApprovalStatus(Integer blogId, boolean isApproved) {
        Blog blog = blogRepository.findById(blogId).orElseThrow(() -> new RuntimeException("Blog not found"));
        blog.setApprovalStatus(isApproved ? ApprovalStatus.APPROVED : ApprovalStatus.REJECTED);
        Blog updatedBlog = blogRepository.save(blog);
        return BlogMapper.toResponseDTO(updatedBlog);
    }

    public BlogResponseDTO likeBlog(Integer blogId) {
        String username = getUsernameFromContext();
        Integer userId = userService.getUserIdByUsername(username);

        Blog blog = blogRepository.findById(blogId).orElseThrow(() -> new RuntimeException("Blog not found"));
        if (blogLikeRepository.existsByBlogIdAndUserUserId(blogId, userId)) {
            throw new RuntimeException("Blog already liked");
        }

        BlogLike blogLike = new BlogLike();
        blogLike.setBlog(blog);
        blogLike.setUser(userRepository.findById(userId).orElseThrow(() -> new RuntimeException("User not found")));
        blog.setLikeCount(blog.getLikeCount() + 1);
        blogLikeRepository.save(blogLike);
        blogRepository.save(blog);

        return BlogMapper.toResponseDTO(blog);
    }

    public BlogResponseDTO unlikeBlog(Integer blogId) {
        String username = getUsernameFromContext();
        Integer userId = userService.getUserIdByUsername(username);

        Blog blog = blogRepository.findById(blogId).orElseThrow(() -> new RuntimeException("Blog not found"));
        BlogLike blogLike = blogLikeRepository.findByBlogIdAndUserUserId(blogId, userId).orElseThrow(() -> new RuntimeException("Like not found"));

        blogLikeRepository.delete(blogLike);

        blog.setLikeCount(blog.getLikeCount() - 1);
        blogRepository.save(blog);

        return BlogMapper.toResponseDTO(blog);    }

    private String getUsernameFromContext() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return (principal instanceof UserDetails) ? ((UserDetails) principal).getUsername() : principal.toString();
    }

    @Transactional
    public List<BlogResponseDTO> getAllApprovedBlogs() {
        return blogRepository.findAllByApprovalStatus(ApprovalStatus.APPROVED)
                .stream()
                .map(BlogMapper::toResponseDTO)
                .toList();
    }

    @Transactional
    public List<BlogResponseDTO> getBlogsByUser(Integer userId) {
        String username = getUsernameFromContext();
        Integer currentUserId = userService.getUserIdByUsername(username);
        if (currentUserId == null) {
            throw new RuntimeException("User not found");
        }
        boolean isAdmin = userService.isAdmin(currentUserId);
        if (isAdmin) {
            return blogRepository.findByUserId(userId)
                    .stream()
                    .map(BlogMapper::toResponseDTO)
                    .toList();
        } else {
            return blogRepository.findByUserIdAndApprovalStatus(userId, ApprovalStatus.APPROVED)
                    .stream()
                    .map(BlogMapper::toResponseDTO)
                    .toList();
        }
    }


    @Transactional
    public List<BlogResponseDTO> searchBlogsByPartialTitle(String title) {
        String normalizedTitle = title.trim().toLowerCase();

        return blogRepository.findByTitleContainingIgnoreCase(normalizedTitle)
                .stream()
                .map(BlogMapper::toResponseDTO)
                .toList();
    }

    @Transactional
    public List<BlogResponseDTO> getAllNotApprovedBlogs() {
        return blogRepository.findAllByApprovalStatus(ApprovalStatus.PENDING)
                .stream()
                .map(BlogMapper::toResponseDTO)
                .toList();
    }

    @Transactional
    public List<BlogResponseDTO> getAllRejectedBlogs() {
        return blogRepository.findAllByApprovalStatus(ApprovalStatus.REJECTED)
                .stream()
                .map(BlogMapper::toResponseDTO)
                .toList();
    }

}