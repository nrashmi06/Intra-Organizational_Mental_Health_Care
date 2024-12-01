package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.blog.request.BlogRequestDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogResponseDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogSummaryDTO;
import com.dbms.mentalhealth.enums.BlogApprovalStatus;
import com.dbms.mentalhealth.exception.blog.BlogNotFoundException;
import com.dbms.mentalhealth.exception.user.UserNotFoundException;
import com.dbms.mentalhealth.mapper.BlogMapper;
import com.dbms.mentalhealth.model.Blog;
import com.dbms.mentalhealth.model.BlogLike;
import com.dbms.mentalhealth.repository.BlogLikeRepository;
import com.dbms.mentalhealth.repository.BlogRepository;
import com.dbms.mentalhealth.repository.UserRepository;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.BlogService;
import com.dbms.mentalhealth.service.ImageStorageService;
import com.dbms.mentalhealth.service.UserService;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.context.request.RequestContextHolder;
import org.springframework.web.context.request.ServletRequestAttributes;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@Service
public class BlogServiceImpl implements BlogService {

    private final UserRepository userRepository;
    private final BlogRepository blogRepository;
    private final BlogLikeRepository blogLikeRepository;
    private final UserService userService;
    private final ImageStorageService imageStorageService;
    private final JwtUtils jwtUtils;

    @Autowired
    public BlogServiceImpl(UserRepository userRepository, ImageStorageService imageStorageService, BlogRepository blogRepository, BlogLikeRepository blogLikeRepository, UserServiceImpl userService, JwtUtils jwtUtils) {
        this.blogRepository = blogRepository;
        this.blogLikeRepository = blogLikeRepository;
        this.userService = userService;
        this.imageStorageService = imageStorageService;
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
    }

    @Transactional
    public BlogResponseDTO createBlog(BlogRequestDTO blogRequestDTO, MultipartFile image) throws Exception {
        Blog blog = BlogMapper.toEntity(blogRequestDTO);
        Integer userId = getUserIdFromContext();
        blog.setUserId(userId);

        if (image != null && !image.isEmpty()) {
            String imageUrl = imageStorageService.uploadImage(image);
            blog.setImageUrl(imageUrl);
        }
        if (blog.getBlogApprovalStatus() == null) {
            blog.setBlogApprovalStatus(BlogApprovalStatus.PENDING);
        }
        Blog createdBlog = blogRepository.save(blog);
        return BlogMapper.toResponseDTO(createdBlog, false);
    }

    public Optional<BlogResponseDTO> getBlogById(Integer blogId) {
        Integer userId = getUserIdFromContext();
        boolean isAdmin = userService.isAdmin(userId);

        return blogRepository.findById(blogId)
                .map(blog -> {
                    if (blog.getBlogApprovalStatus() == BlogApprovalStatus.APPROVED || isAdmin) {
                        blog.setViewCount(blog.getViewCount() + 1);
                        blogRepository.save(blog);
                        boolean likedByCurrentUser = blogLikeRepository.existsByBlogIdAndUserUserId(blogId, userId);
                        return BlogMapper.toResponseDTO(blog, likedByCurrentUser);
                    }
                    return null;
                });
    }

    @Transactional
    public BlogResponseDTO updateBlog(Integer blogId, BlogRequestDTO blogRequestDTO, MultipartFile image) throws Exception {
        Blog blog = blogRepository.findById(blogId).orElseThrow(() -> new RuntimeException("Blog not found"));

        if (!isCurrentUserPublisher(blog.getUserId())) {
            throw new RuntimeException("You are not authorized to edit this blog");
        }
        if (image != null && !image.isEmpty()) {
            imageStorageService.deleteImage(blog.getImageUrl());
            String imageUrl = imageStorageService.uploadImage(image);
            blog.setImageUrl(imageUrl);
        }
        blog.setTitle(blogRequestDTO.getTitle());
        blog.setContent(blogRequestDTO.getContent());
        blog.setSummary(blogRequestDTO.getSummary());
        blog.setBlogApprovalStatus(BlogApprovalStatus.PENDING);
        Blog updatedBlog = blogRepository.save(blog);
        boolean likedByCurrentUser = blogLikeRepository.existsByBlogIdAndUserUserId(blogId, getUserIdFromContext());
        return BlogMapper.toResponseDTO(updatedBlog, likedByCurrentUser);
    }

    @Transactional
    public void deleteBlog(Integer blogId) throws Exception {
        Blog blog = blogRepository.findById(blogId).orElseThrow(() -> new BlogNotFoundException("Blog not found"));
        if (blog.getImageUrl() != null) {
            imageStorageService.deleteImage(blog.getImageUrl());
        }
        blogRepository.deleteById(blogId);
    }

    private boolean isCurrentUserPublisher(Integer blogUserId) {
        Integer currentUserId = getUserIdFromContext();
        return currentUserId.equals(blogUserId);
    }

    public BlogResponseDTO updateBlogApprovalStatus(Integer blogId, boolean isApproved) {
        Blog blog = blogRepository.findById(blogId).orElseThrow(() -> new BlogNotFoundException("Blog not found"));
        blog.setBlogApprovalStatus(isApproved ? BlogApprovalStatus.APPROVED : BlogApprovalStatus.REJECTED);
        Blog updatedBlog = blogRepository.save(blog);
        boolean likedByCurrentUser = blogLikeRepository.existsByBlogIdAndUserUserId(blogId, getUserIdFromContext());
        return BlogMapper.toResponseDTO(updatedBlog, likedByCurrentUser);
    }

    public BlogResponseDTO likeBlog(Integer blogId) {
        Integer userId = getUserIdFromContext();

        Blog blog = blogRepository.findById(blogId).orElseThrow(() -> new BlogNotFoundException("Blog not found"));
        if (blogLikeRepository.existsByBlogIdAndUserUserId(blogId, userId)) {
            throw new RuntimeException("Blog already liked");
        }

        BlogLike blogLike = new BlogLike();
        blogLike.setBlog(blog);
        blogLike.setUser(userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found")));
        blog.setLikeCount(blog.getLikeCount() + 1);
        blogLikeRepository.save(blogLike);
        blogRepository.save(blog);

        return BlogMapper.toResponseDTO(blog, true);
    }

    public BlogResponseDTO unlikeBlog(Integer blogId) {
        Integer userId = getUserIdFromContext();

        Blog blog = blogRepository.findById(blogId).orElseThrow(() -> new BlogNotFoundException("Blog not found"));
        BlogLike blogLike = blogLikeRepository.findByBlogIdAndUserUserId(blogId, userId).orElseThrow(() -> new UserNotFoundException("Like not found"));

        blogLikeRepository.delete(blogLike);

        blog.setLikeCount(blog.getLikeCount() - 1);
        blogRepository.save(blog);

        return BlogMapper.toResponseDTO(blog, false);
    }

    @Transactional
    public List<BlogSummaryDTO> getBlogsByUser(Integer userId) {
        Integer currentUserId = getUserIdFromContext();
        boolean isAdmin = userService.isAdmin(currentUserId);
        if (isAdmin) {
            return blogRepository.findByUserId(userId)
                    .stream()
                    .map(blog -> {
                        boolean likedByCurrentUser = blogLikeRepository.existsByBlogIdAndUserUserId(blog.getId(), currentUserId);
                        return BlogMapper.toSummaryDTO(blog, likedByCurrentUser);
                    })
                    .toList();
        } else {
            return blogRepository.findByUserIdAndBlogApprovalStatus(userId, BlogApprovalStatus.APPROVED)
                    .stream()
                    .map(blog -> {
                        boolean likedByCurrentUser = blogLikeRepository.existsByBlogIdAndUserUserId(blog.getId(), currentUserId);
                        return BlogMapper.toSummaryDTO(blog, likedByCurrentUser);
                    })
                    .toList();
        }
    }

    @Transactional
    public List<BlogSummaryDTO> searchBlogsByPartialTitle(String title) {
        String normalizedTitle = title.trim().toLowerCase();
        Integer userId = getUserIdFromContext();

        return blogRepository.findByTitleContainingIgnoreCase(normalizedTitle)
                .stream()
                .map(blog -> {
                    boolean likedByCurrentUser = blogLikeRepository.existsByBlogIdAndUserUserId(blog.getId(), userId);
                    return BlogMapper.toSummaryDTO(blog, likedByCurrentUser);
                })
                .toList();
    }

    @Transactional
    public List<BlogSummaryDTO> getBlogsByApprovalStatus(String status) {
        Integer userId = getUserIdFromContext();
        boolean isAdmin = userService.isAdmin(userId);

        if (!isAdmin && !status.equalsIgnoreCase("approved")) {
            throw new IllegalArgumentException("Only approved blogs can be retrieved by non-admin users");
        }

        BlogApprovalStatus blogApprovalStatus;
        switch (status.toLowerCase()) {
            case "approved":
                blogApprovalStatus = BlogApprovalStatus.APPROVED;
                break;
            case "pending":
                blogApprovalStatus = BlogApprovalStatus.PENDING;
                break;
            case "rejected":
                blogApprovalStatus = BlogApprovalStatus.REJECTED;
                break;
            default:
                throw new IllegalArgumentException("Invalid status: " + status);
        }
        List<Blog> blogs = blogRepository.findAllByBlogApprovalStatus(blogApprovalStatus);
        return blogs.stream()
                .map(blog -> {
                    boolean likedByCurrentUser = blogLikeRepository.existsByBlogIdAndUserUserId(blog.getId(), userId);
                    return BlogMapper.toSummaryDTO(blog, likedByCurrentUser);
                })
                .toList();
    }

    private Integer getUserIdFromContext() {
        HttpServletRequest request = ((ServletRequestAttributes) RequestContextHolder.getRequestAttributes()).getRequest();
        String jwt = jwtUtils.getJwtFromHeader(request);
        return jwtUtils.getUserIdFromJwtToken(jwt);
    }
}