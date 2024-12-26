package com.dbms.mentalhealth.service.cachableImpl;

import com.dbms.mentalhealth.dto.blog.request.BlogRequestDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogResponseDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogSummaryDTO;
import com.dbms.mentalhealth.exception.blog.BlogNotFoundException;
import com.dbms.mentalhealth.mapper.BlogMapper;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.BlogService;
import com.dbms.mentalhealth.service.impl.BlogServiceImpl;
import com.github.benmanes.caffeine.cache.Cache;
import org.springframework.context.annotation.Primary;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

import java.util.List;
import java.util.Optional;
import java.util.concurrent.atomic.AtomicLong;

@Service
@Primary
public class CacheableBlogServiceImpl implements BlogService {

    private final BlogServiceImpl blogServiceImpl;
    private final Cache<String, BlogResponseDTO> blogCache;
    private final Cache<String, List<BlogSummaryDTO>> blogListCache;
    private final Cache<Integer, AtomicLong> viewCountCache;
    private final Cache<String, Boolean> recentViewCache;
    private static final Logger logger = LoggerFactory.getLogger(CacheableBlogServiceImpl.class);
    private final JwtUtils jwtUtils;

    public CacheableBlogServiceImpl(BlogServiceImpl blogServiceImpl,
                                    Cache<String, BlogResponseDTO> blogCache,
                                    Cache<String, List<BlogSummaryDTO>> blogListCache,
                                    Cache<Integer, AtomicLong> viewCountCache,
                                    Cache<String, Boolean> recentViewCache, JwtUtils jwtUtils) {
        this.blogServiceImpl = blogServiceImpl;
        this.blogCache = blogCache;
        this.blogListCache = blogListCache;
        this.viewCountCache = viewCountCache;
        this.recentViewCache = recentViewCache;
        this.jwtUtils = jwtUtils;
        logger.info("CacheableBlogServiceImpl initialized with view count tracking");
    }

    private String generateBlogCacheKey(Integer blogId, Integer authorId, Integer viewerId) {
        return String.format("blog:%d:author:%d:viewer:%d", blogId, authorId, viewerId);
    }

    @Override
    @Transactional
    public Optional<BlogResponseDTO> getBlogById(Integer blogId) {
        Integer currentUserId = jwtUtils.getUserIdFromContext();
        String recentViewKey = "user_" + currentUserId + "_blog_" + blogId;

        if (recentViewCache.getIfPresent(recentViewKey) == null) {
            recentViewCache.put(recentViewKey, true);
            AtomicLong viewCountDelta = viewCountCache.get(blogId, k -> new AtomicLong(0));
            viewCountDelta.incrementAndGet();
        }

        Optional<BlogResponseDTO> response = blogServiceImpl.getBlogById(blogId);
        if (response.isPresent()) {
            BlogResponseDTO blog = response.get();
            String cacheKey = generateBlogCacheKey(blogId, blog.getUserId(), currentUserId);

            BlogResponseDTO cachedBlog = blogCache.get(cacheKey, k -> blog);
            return Optional.of(cachedBlog);
        }

        return response;
    }

    @Scheduled(fixedRate = 300000) // Every 5 minutes
    public void flushPendingViewCounts() {
        viewCountCache.asMap().forEach((blogId, delta) -> {
            long pendingCount = delta.get();
            if (pendingCount > 0) {
                try {
                    blogServiceImpl.incrementViewCountByAmount(blogId, (int) pendingCount);
                    viewCountCache.invalidate(blogId);
                    Optional<BlogResponseDTO> updatedBlog = blogServiceImpl.getBlogById(blogId);
                    updatedBlog.ifPresent(blog -> {
                        Integer userId = blog.getUserId();
                        String cacheKey = generateBlogCacheKey(blogId, userId, userId);
                        blogCache.put(cacheKey, blog);
                    });
                } catch (Exception e) {
                    logger.error("Failed to flush pending view counts for blog ID: {}", blogId, e);
                }
            }
        });
    }

    @Override
    @Transactional(readOnly = true)
    public List<BlogSummaryDTO> getBlogsByUser(Integer userId) {
        String cacheKey = "user_" + userId;
        logger.info("Cache lookup for user blogs with key: {}", cacheKey);

        List<BlogSummaryDTO> cachedBlogs = blogListCache.getIfPresent(cacheKey);
        if (cachedBlogs != null) {
            logger.debug("Cache HIT - Returning cached blogs for user ID: {}", userId);
            return cachedBlogs;
        }

        logger.info("Cache MISS - Fetching blogs from database for user ID: {}", userId);
        List<BlogSummaryDTO> response = blogServiceImpl.getBlogsByUser(userId);
        blogListCache.put(cacheKey, response);
        logger.debug("Cached {} blogs for user ID: {}", response.size(), userId);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<BlogSummaryDTO> searchBlogsByPartialTitle(String title) {
        String cacheKey = "search_" + title.toLowerCase();
        logger.info("Cache lookup for search with key: {}", cacheKey);

        List<BlogSummaryDTO> cachedBlogs = blogListCache.getIfPresent(cacheKey);
        if (cachedBlogs != null) {
            logger.debug("Cache HIT - Returning cached search results for: {}", title);
            return cachedBlogs;
        }

        logger.info("Cache MISS - Performing database search for: {}", title);
        List<BlogSummaryDTO> response = blogServiceImpl.searchBlogsByPartialTitle(title);
        blogListCache.put(cacheKey, response);
        logger.debug("Cached {} search results for: {}", response.size(), title);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<BlogSummaryDTO> getBlogsByApprovalStatus(String status) {
        String cacheKey = "status_" + status.toLowerCase();
        logger.info("Cache lookup for approval status with key: {}", cacheKey);

        List<BlogSummaryDTO> cachedBlogs = blogListCache.getIfPresent(cacheKey);
        if (cachedBlogs != null) {
            logger.debug("Cache HIT - Returning cached blogs for status: {}", status);
            return cachedBlogs;
        }

        logger.info("Cache MISS - Fetching blogs from database for status: {}", status);
        List<BlogSummaryDTO> response = blogServiceImpl.getBlogsByApprovalStatus(status);
        blogListCache.put(cacheKey, response);
        logger.debug("Cached {} blogs for status: {}", response.size(), status);

        return response;
    }

    @Override
    @Transactional
    public BlogResponseDTO createBlog(BlogRequestDTO blogRequestDTO, MultipartFile image) throws Exception {
        logger.info("Creating new blog - invalidating relevant caches");
        BlogResponseDTO response = blogServiceImpl.createBlog(blogRequestDTO, image);

        AtomicLong viewCountDelta = viewCountCache.get(response.getPostId(), k -> new AtomicLong(0));
        long newDelta = viewCountDelta.get();

        BlogResponseDTO adjustedResponse = BlogMapper.toResponseDTOWithAdjustedViewCount(response, newDelta);
        String cacheKey = generateBlogCacheKey(response.getPostId(), response.getUserId(), response.getUserId());
        blogCache.put(cacheKey, adjustedResponse);

        invalidateUserAndStatusCaches(response.getUserId(), "pending");
        logger.info("Relevant caches invalidated after blog creation");
        return adjustedResponse;
    }

    @Override
    @Transactional
    public BlogResponseDTO updateBlog(Integer blogId, BlogRequestDTO blogRequestDTO, MultipartFile image) throws Exception {
        logger.info("Updating blog ID: {} - updating caches", blogId);
        BlogResponseDTO response = blogServiceImpl.updateBlog(blogId, blogRequestDTO, image);

        AtomicLong viewCountDelta = viewCountCache.get(blogId, k -> new AtomicLong(0));
        long newDelta = viewCountDelta.get();

        BlogResponseDTO adjustedResponse = BlogMapper.toResponseDTOWithAdjustedViewCount(response, newDelta);
        String cacheKey = generateBlogCacheKey(blogId, response.getUserId(), response.getUserId());
        blogCache.put(cacheKey, adjustedResponse);

        invalidateUserAndStatusCaches(response.getUserId(), "pending");
        logger.info("Blog cache updated and relevant list caches invalidated for blog ID: {}", blogId);
        return adjustedResponse;
    }

    @Override
    @Transactional
    public void deleteBlog(Integer blogId) throws Exception {
        logger.info("Deleting blog ID: {} - removing from caches", blogId);

        // Get blog details before deletion
        BlogResponseDTO blog = blogServiceImpl.getBlogById(blogId)
                .orElseThrow(() -> new BlogNotFoundException("Blog not found"));
        String status = blog.getBlogApprovalStatus().toString().toLowerCase();
        Integer userId = blog.getUserId();

        // Delete the blog
        blogServiceImpl.deleteBlog(blogId);

        // Invalidate all caches related to this blog
        String statusCacheKey = "status_" + status;
        String userCacheKey = "user_" + userId;

        // Invalidate individual blog cache for all viewers
        blogCache.asMap().keySet().stream()
                .filter(key -> key.startsWith("blog:" + blogId))
                .forEach(blogCache::invalidate);

        // Invalidate list caches
        blogListCache.invalidate(statusCacheKey);
        blogListCache.invalidate(userCacheKey);

        // Invalidate view count cache
        viewCountCache.invalidate(blogId);

        logger.info("Blog removed from all caches for blog ID: {}", blogId);
    }

    @Override
    public BlogResponseDTO updateBlogApprovalStatus(Integer blogId, boolean isApproved) {
        logger.info("Updating approval status for blog ID: {} to {}", blogId, isApproved);

        // Get the blog's current status before update
        BlogResponseDTO currentBlog = blogServiceImpl.getBlogById(blogId)
                .orElseThrow(() -> new BlogNotFoundException("Blog not found"));
        String oldStatus = currentBlog.getBlogApprovalStatus().toString().toLowerCase();

        // Update the status
        BlogResponseDTO response = blogServiceImpl.updateBlogApprovalStatus(blogId, isApproved);
        String newStatus = response.getBlogApprovalStatus().toString().toLowerCase();

        // Invalidate caches for both old and new status
        String oldStatusCacheKey = "status_" + oldStatus;
        String newStatusCacheKey = "status_" + newStatus;
        blogListCache.invalidate(oldStatusCacheKey);
        blogListCache.invalidate(newStatusCacheKey);

        // Update individual blog cache
        AtomicLong viewCountDelta = viewCountCache.get(blogId, k -> new AtomicLong(0));
        long newDelta = viewCountDelta.get();

        BlogResponseDTO adjustedResponse = BlogMapper.toResponseDTOWithAdjustedViewCount(response, newDelta);

        // Invalidate cache for all users viewing this blog
        blogCache.asMap().keySet().stream()
                .filter(key -> key.startsWith("blog:" + blogId))
                .forEach(blogCache::invalidate);

        // Update cache with new status
        String cacheKey = generateBlogCacheKey(blogId, response.getUserId(), response.getUserId());
        blogCache.put(cacheKey, adjustedResponse);

        // Invalidate user's blog list cache
        invalidateUserAndStatusCaches(response.getUserId(), newStatus);
        logger.info("Updated blog cache and relevant list caches invalidated after approval status change for blog ID: {}", blogId);

        return adjustedResponse;
    }
    @Override
    public BlogResponseDTO likeBlog(Integer blogId) {
        logger.info("Processing like for blog ID: {}", blogId);
        Integer currentUserId = jwtUtils.getUserIdFromContext();

        BlogResponseDTO response = blogServiceImpl.likeBlog(blogId);

        // Invalidate cache for all users viewing this blog
        blogCache.asMap().keySet().stream()
                .filter(key -> key.startsWith("blog:" + blogId))
                .forEach(blogCache::invalidate);

        // Update cache for current user
        String cacheKey = generateBlogCacheKey(blogId, response.getUserId(), currentUserId);
        AtomicLong viewCountDelta = viewCountCache.get(blogId, k -> new AtomicLong(0));
        BlogResponseDTO adjustedResponse = BlogMapper.toResponseDTOWithAdjustedViewCount(response, viewCountDelta.get());
        blogCache.put(cacheKey, adjustedResponse);

        invalidateUserAndStatusCaches(response.getUserId(), response.getBlogApprovalStatus().toString());
        return adjustedResponse;
    }

    @Override
    public BlogResponseDTO unlikeBlog(Integer blogId) {
        logger.info("Processing unlike for blog ID: {}", blogId);
        Integer currentUserId = jwtUtils.getUserIdFromContext();

        BlogResponseDTO response = blogServiceImpl.unlikeBlog(blogId);

        // Invalidate cache for all users viewing this blog
        blogCache.asMap().keySet().stream()
                .filter(key -> key.startsWith("blog:" + blogId))
                .forEach(blogCache::invalidate);

        // Update cache for current user
        String cacheKey = generateBlogCacheKey(blogId, response.getUserId(), currentUserId);
        AtomicLong viewCountDelta = viewCountCache.get(blogId, k -> new AtomicLong(0));
        BlogResponseDTO adjustedResponse = BlogMapper.toResponseDTOWithAdjustedViewCount(response, viewCountDelta.get());
        blogCache.put(cacheKey, adjustedResponse);

        invalidateUserAndStatusCaches(response.getUserId(), response.getBlogApprovalStatus().toString());
        return adjustedResponse;
    }

    private void invalidateUserAndStatusCaches(Integer userId, String status) {
        String userCacheKey = "user_" + userId;
        String statusCacheKey = "status_" + status.toLowerCase();
        blogListCache.invalidate(userCacheKey);
        blogListCache.invalidate(statusCacheKey);
    }

    public void logCacheStats() {
        logger.info("Current Cache Statistics:");
        logger.info("Blog Cache - Size: {}", blogCache.estimatedSize());
        logger.info("Blog List Cache - Size: {}", blogListCache.estimatedSize());
    }
}