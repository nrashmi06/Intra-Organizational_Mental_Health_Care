package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.blog.trending.TrendingBlogSummaryDTO;
import com.dbms.mentalhealth.dto.blog.request.BlogRequestDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogResponseDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogSummaryDTO;
import com.dbms.mentalhealth.enums.BlogApprovalStatus;
import com.dbms.mentalhealth.exception.blog.BlogNotFoundException;
import com.dbms.mentalhealth.exception.token.UnauthorizedException;
import com.dbms.mentalhealth.exception.user.UserNotFoundException;
import com.dbms.mentalhealth.mapper.BlogMapper;
import com.dbms.mentalhealth.mapper.TrendingScoreMapper;
import com.dbms.mentalhealth.model.*;
import com.dbms.mentalhealth.repository.*;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.*;
import com.github.benmanes.caffeine.cache.Cache;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.concurrent.CompletableFuture;

@Service
public class BlogServiceImpl implements BlogService {

    private final UserRepository userRepository;
    private final BlogRepository blogRepository;
    private final BlogLikeRepository blogLikeRepository;
    private final UserService userService;
    private final ImageStorageService imageStorageService;
    private final JwtUtils jwtUtils;
    private final EmailService emailService;
    private final AdminRepository adminRepository;
    private final BlogTrendingScoreRepository blogTrendingScoreRepository;
    private final Cache<String, LocalDateTime> blogViewCache;
    private final UserMetricService userMetricService;

    @Autowired
    public BlogServiceImpl(UserRepository userRepository,
                           ImageStorageService imageStorageService,
                           BlogRepository blogRepository,
                           BlogLikeRepository blogLikeRepository,
                           UserService userService,
                           JwtUtils jwtUtils,
                           EmailService emailService,
                           AdminRepository adminRepository,
                           BlogTrendingScoreRepository blogTrendingScoreRepository,
                           Cache<String, LocalDateTime> blogViewCache,
                           UserMetricService userMetricService) {
        this.blogRepository = blogRepository;
        this.blogLikeRepository = blogLikeRepository;
        this.userService = userService;
        this.imageStorageService = imageStorageService;
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
        this.emailService = emailService;
        this.adminRepository = adminRepository;
        this.blogTrendingScoreRepository = blogTrendingScoreRepository;
        this.blogViewCache = blogViewCache;
        this.userMetricService = userMetricService;
    }

    @Transactional
    public BlogResponseDTO createBlog(BlogRequestDTO blogRequestDTO, MultipartFile image) throws Exception {
        Blog blog = BlogMapper.toEntity(blogRequestDTO);
        Integer userId = jwtUtils.getUserIdFromContext();
        blog.setUserId(userId);

        if (image != null && !image.isEmpty()) {
            CompletableFuture<String> imageUrlFuture = imageStorageService.uploadImage(image);
            blog.setImageUrl(imageUrlFuture.get());
        }
        if (blog.getBlogApprovalStatus() == null) {
            blog.setBlogApprovalStatus(BlogApprovalStatus.PENDING);
        }
        Blog createdBlog = blogRepository.save(blog);

        // Send email notifications asynchronously
        String userEmail = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found"))
                .getEmail();
        emailService.sendBlogSubmissionReceivedEmail(userEmail, createdBlog.getId().toString());

        List<String> adminEmails = adminRepository.findAll().stream()
                .map(Admin::getEmail)
                .toList();
        for (String adminEmail : adminEmails) {
            emailService.sendNewBlogSubmissionEmailToAdmin(adminEmail, userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found")).getAnonymousName(), blog.getTitle());
        }

        return BlogMapper.toResponseDTO(createdBlog, false);
    }

    @Transactional
    public Optional<BlogResponseDTO> getBlogById(Integer blogId) {
        Integer userId = jwtUtils.getUserIdFromContext();
        boolean isAdmin = userService.isAdmin(userId);

        Optional<Blog> optionalBlog = blogRepository.findById(blogId);

        if (optionalBlog.isEmpty()) {
            return Optional.empty();
        }

        Blog blog = optionalBlog.get();

        if (blog.getBlogApprovalStatus() != BlogApprovalStatus.APPROVED && !isAdmin) {
            throw new UnauthorizedException("Blog not approved yet");
        }

        // Check if this user has viewed this blog within the cooldown period
        String cacheKey = generateViewCacheKey(userId, blogId);
        if (blogViewCache.getIfPresent(cacheKey) == null) {
            // No recent view found, increment view count and update cache
            blog.setViewCount(blog.getViewCount() + 1);
            userMetricService.incrementViewCount(userRepository.findById(blog.getUserId()).orElseThrow(() -> new UserNotFoundException("User not found")));
            blogRepository.save(blog);
            blogViewCache.put(cacheKey, LocalDateTime.now());
        }

        boolean likedByCurrentUser = blogLikeRepository.existsByBlogIdAndUserUserId(blogId, userId);
        BlogResponseDTO responseDTO = BlogMapper.toResponseDTO(blog, likedByCurrentUser);

        return Optional.of(responseDTO);
    }

    // Helper method to generate cache key
    private String generateViewCacheKey(Integer userId, Integer blogId) {
        return "blog-view:" + userId + ":" + blogId;
    }

    @Transactional
    public BlogResponseDTO updateBlog(Integer blogId, BlogRequestDTO blogRequestDTO, MultipartFile image) throws Exception {
        Blog blog = blogRepository.findById(blogId).orElseThrow(() -> new BlogNotFoundException("Blog not found"));

        if (!isCurrentUserPublisher(blog.getUserId())) {
            throw new UnauthorizedException("You are not authorized to edit this blog");
        }
        if (image != null && !image.isEmpty()) {
            imageStorageService.deleteImage(blog.getImageUrl()).get();
            CompletableFuture<String> imageUrlFuture = imageStorageService.uploadImage(image);
            blog.setImageUrl(imageUrlFuture.get());
        }
        blog.setTitle(blogRequestDTO.getTitle());
        blog.setContent(blogRequestDTO.getContent());
        blog.setSummary(blogRequestDTO.getSummary());
        blog.setBlogApprovalStatus(BlogApprovalStatus.PENDING);
        Blog updatedBlog = blogRepository.save(blog);
        boolean likedByCurrentUser = blogLikeRepository.existsByBlogIdAndUserUserId(blogId, jwtUtils.getUserIdFromContext());
        return BlogMapper.toResponseDTO(updatedBlog, likedByCurrentUser);
    }

    @Transactional
    public void deleteBlog(Integer blogId) throws Exception {
        Blog blog = blogRepository.findById(blogId).orElseThrow(() -> new BlogNotFoundException("Blog not found"));
        blogLikeRepository.deleteAllByBlog(blog);
        if (blog.getImageUrl() != null) {
            imageStorageService.deleteImage(blog.getImageUrl()).get();
        }
        blogRepository.delete(blog);
    }

    private boolean isCurrentUserPublisher(Integer blogUserId) {
        Integer currentUserId = jwtUtils.getUserIdFromContext();
        return currentUserId.equals(blogUserId);
    }

    public BlogResponseDTO updateBlogApprovalStatus(Integer blogId, boolean isApproved) {
        Blog blog = blogRepository.findById(blogId).orElseThrow(() -> new BlogNotFoundException("Blog not found"));
        blog.setBlogApprovalStatus(isApproved ? BlogApprovalStatus.APPROVED : BlogApprovalStatus.REJECTED);
        User user = userRepository.findById(blog.getUserId()).orElseThrow(() -> new UserNotFoundException("User not found"));

        if (isApproved) {
            blog.setApprovedBy(jwtUtils.getUserIdFromContext().toString());
            blog.setPublishDate(LocalDateTime.now());
            userMetricService.updateBlogCount(user,1);
        } else {
            blog.setApprovedBy(null);
            blog.setPublishDate(null);
            userMetricService.updateBlogCount(user,-1);
        }

        Blog updatedBlog = blogRepository.save(blog);
        boolean likedByCurrentUser = blogLikeRepository.existsByBlogIdAndUserUserId(blogId, jwtUtils.getUserIdFromContext());

        String userEmail = userRepository.findById(blog.getUserId())
                .orElseThrow(() -> new UserNotFoundException("User not found"))
                .getEmail();

        if (isApproved) {
            // Send email notification to the user
            emailService.sendBlogAcceptanceEmail(userEmail, blog.getTitle());
        } else {
            // Send email notification to the user
            emailService.sendBlogRejectionEmail(userEmail, blog.getTitle());
        }

        return BlogMapper.toResponseDTO(updatedBlog, likedByCurrentUser);
    }

    @Transactional
    public BlogResponseDTO likeBlog(Integer blogId) {
        Integer userId = jwtUtils.getUserIdFromContext();

        Blog blog = blogRepository.findById(blogId).orElseThrow(() -> new BlogNotFoundException("Blog not found"));
        if (blogLikeRepository.existsByBlogIdAndUserUserId(blogId, userId)) {
            throw new RuntimeException("Blog already liked by the user");
        }
        BlogLike blogLike = new BlogLike();
        blogLike.setBlog(blog);
        userMetricService.updateBlogCount(userRepository.findById(blog.getUserId()).orElseThrow(() -> new UserNotFoundException("User not found")),1);
        blogLike.setUser(userRepository.findById(userId).orElseThrow(() -> new UserNotFoundException("User not found")));
        blog.setLikeCount(blog.getLikeCount() + 1);
        blogLike.setCreatedAt(LocalDateTime.now());
        blogLikeRepository.save(blogLike);
        blogRepository.save(blog);

        return BlogMapper.toResponseDTO(blog, true);
    }

    @Transactional
    public BlogResponseDTO unlikeBlog(Integer blogId) {
        Integer userId = jwtUtils.getUserIdFromContext();

        Blog blog = blogRepository.findById(blogId).orElseThrow(() -> new BlogNotFoundException("Blog not found"));
        BlogLike blogLike = blogLikeRepository.findByBlogIdAndUserUserId(blogId, userId).orElseThrow(() -> new UserNotFoundException("Like not found"));
        userMetricService.updateBlogCount(userRepository.findById(blog.getUserId()).orElseThrow(() -> new UserNotFoundException("User not found")),-1);
        blogLikeRepository.delete(blogLike);

        blog.setLikeCount(blog.getLikeCount() - 1);
        blogRepository.save(blog);

        return BlogMapper.toResponseDTO(blog, false);
    }


    @Transactional(readOnly = true)
    public Page<BlogSummaryDTO> getBlogsByApprovalStatus(String status, Pageable pageable) {
        Integer currentUserId = jwtUtils.getUserIdFromContext();
        boolean isAdmin = userService.isAdmin(currentUserId);

        if (!isAdmin && !status.equalsIgnoreCase("approved")) {
            throw new UnauthorizedException("Only approved blogs can be retrieved by non-admin users");
        }

        BlogApprovalStatus blogApprovalStatus;
        try {
            blogApprovalStatus = BlogApprovalStatus.valueOf(status.toUpperCase());
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid approval status: " + status);
        }

        Page<Blog> blogs = blogRepository.findByBlogApprovalStatus(blogApprovalStatus, null, pageable);

        return blogs.map(blog -> {
            boolean likedByCurrentUser = blogLikeRepository.existsByBlogIdAndUserUserId(blog.getId(), currentUserId);
            return BlogMapper.toSummaryDTO(blog, likedByCurrentUser);
        });
    }

    @Transactional(readOnly = true)
    public Page<BlogSummaryDTO> filterBlogs(Integer userId, String title, Pageable pageable) {
        Integer currentUserId = jwtUtils.getUserIdFromContext();
        return blogRepository.filterBlogs(userId, title, pageable)
                .map(blog -> BlogMapper.toSummaryDTO(blog,
                        blogLikeRepository.existsByBlogIdAndUserUserId(blog.getId(), currentUserId)));
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TrendingBlogSummaryDTO> getTrendingBlogs(Integer userId, String title, Pageable pageable) {
        Integer currentUserId = jwtUtils.getUserIdFromContext();
        Pageable unsorted = PageRequest.of(pageable.getPageNumber(), pageable.getPageSize(), Sort.unsorted());
        Page<BlogTrendingScore> trendingScores = blogTrendingScoreRepository.findTrendingBlogs(userId, title, unsorted);
        return trendingScores.map(score -> {
            Blog blog = blogRepository.findById(score.getBlogId())
                    .orElseThrow(() -> new BlogNotFoundException("Blog not found: " + score.getBlogId()));
            boolean likedByCurrentUser = blogLikeRepository.existsByBlogIdAndUserUserId(blog.getId(), currentUserId);
            return TrendingScoreMapper.toTrendingSummaryDTO(blog, score, likedByCurrentUser);
        });
    }


}