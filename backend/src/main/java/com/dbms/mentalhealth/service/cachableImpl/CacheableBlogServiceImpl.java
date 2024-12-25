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
import java.util.concurrent.CompletableFuture;
import java.util.concurrent.atomic.AtomicLong;

@Service
@Primary
public class CacheableBlogServiceImpl implements BlogService {

    private final BlogServiceImpl blogServiceImpl;
    private final Cache<Integer, BlogResponseDTO> blogCache;
    private final Cache<String, List<BlogSummaryDTO>> blogListCache;
    private final Cache<Integer, AtomicLong> viewCountCache;
    private final Cache<String, Boolean> recentViewCache; // Add this cache
    private static final Logger logger = LoggerFactory.getLogger(CacheableBlogServiceImpl.class);
    private final JwtUtils jwtUtils;

    public CacheableBlogServiceImpl(BlogServiceImpl blogServiceImpl,
                                    Cache<Integer, BlogResponseDTO> blogCache,
                                    Cache<String, List<BlogSummaryDTO>> blogListCache,
                                    Cache<Integer, AtomicLong> viewCountCache,
                                    Cache<String, Boolean> recentViewCache, JwtUtils jwtUtils) { // Add this parameter
        this.blogServiceImpl = blogServiceImpl;
        this.blogCache = blogCache;
        this.blogListCache = blogListCache;
        this.viewCountCache = viewCountCache;
        this.recentViewCache = recentViewCache; // Initialize this cache
        logger.info("CacheableBlogServiceImpl initialized with view count tracking");
        this.jwtUtils = jwtUtils;
    }

    @Override
    @Transactional
    public Optional<BlogResponseDTO> getBlogById(Integer blogId) {
        Integer userId = jwtUtils.getUserIdFromContext(); // Method to get the current user ID
        String recentViewKey = "user_" + userId + "_blog_" + blogId;

        if (recentViewCache.getIfPresent(recentViewKey) == null) {
            recentViewCache.put(recentViewKey, true);
            AtomicLong viewCountDelta = viewCountCache.get(blogId, k -> new AtomicLong(0));
            viewCountDelta.incrementAndGet();
        }

        logger.info("Cache lookup for blog ID: {}", blogId);
        BlogResponseDTO cachedBlog = blogCache.getIfPresent(blogId);

        if (cachedBlog != null) {
            logger.debug("Cache HIT - Returning cached blog for ID: {}", blogId);
            return Optional.of(cachedBlog);
        }

        logger.info("Cache MISS - Fetching blog from database for ID: {}", blogId);
        Optional<BlogResponseDTO> response = blogServiceImpl.getBlogById(blogId);

        if (response.isPresent()) {
            BlogResponseDTO blog = response.get();
            blogCache.put(blogId, blog);
            return Optional.of(blog);
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
                    updatedBlog.ifPresent(blog -> blogCache.put(blogId, blog));
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
        blogCache.put(response.getPostId(), adjustedResponse);

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
        blogCache.put(blogId, adjustedResponse);

        invalidateUserAndStatusCaches(response.getUserId(), "pending");
        logger.info("Blog cache updated and relevant list caches invalidated for blog ID: {}", blogId);
        return adjustedResponse;
    }

    @Override
    @Transactional
    public void deleteBlog(Integer blogId) throws Exception {
        logger.info("Deleting blog ID: {} - removing from caches", blogId);
        BlogResponseDTO blog = blogServiceImpl.getBlogById(blogId).orElseThrow(() -> new BlogNotFoundException("Blog not found"));
        blogServiceImpl.deleteBlog(blogId);
        blogCache.invalidate(blogId);
        invalidateUserAndStatusCaches(blog.getUserId(), blog.getBlogApprovalStatus().toString());
        logger.info("Blog removed from cache and relevant list caches invalidated for blog ID: {}", blogId);
    }

    @Override
    public BlogResponseDTO updateBlogApprovalStatus(Integer blogId, boolean isApproved) {
        logger.info("Updating approval status for blog ID: {} to {}", blogId, isApproved);

        BlogResponseDTO response = blogServiceImpl.updateBlogApprovalStatus(blogId, isApproved);

        AtomicLong viewCountDelta = viewCountCache.get(blogId, k -> new AtomicLong(0));
        long newDelta = viewCountDelta.get();

        BlogResponseDTO adjustedResponse = BlogMapper.toResponseDTOWithAdjustedViewCount(response, newDelta);
        blogCache.put(blogId, adjustedResponse);

        invalidateUserAndStatusCaches(response.getUserId(), response.getBlogApprovalStatus().toString());
        logger.info("Updated blog cache and relevant list caches invalidated after approval status change for blog ID: {}", blogId);

        return adjustedResponse;
    }

    @Override
    public BlogResponseDTO likeBlog(Integer blogId) {
        logger.info("Processing like for blog ID: {}", blogId);

        BlogResponseDTO response = blogServiceImpl.likeBlog(blogId);

        AtomicLong viewCountDelta = viewCountCache.get(blogId, k -> new AtomicLong(0));
        long newDelta = viewCountDelta.get();

        BlogResponseDTO adjustedResponse = BlogMapper.toResponseDTOWithAdjustedViewCount(response, newDelta);
        blogCache.put(blogId, adjustedResponse);

        invalidateUserAndStatusCaches(response.getUserId(), response.getBlogApprovalStatus().toString());
        logger.info("Updated blog cache and relevant list caches invalidated after like for blog ID: {}", blogId);
        return adjustedResponse;
    }

    @Override
    public BlogResponseDTO unlikeBlog(Integer blogId) {
        logger.info("Processing unlike for blog ID: {}", blogId);

        BlogResponseDTO response = blogServiceImpl.unlikeBlog(blogId);

        AtomicLong viewCountDelta = viewCountCache.get(blogId, k -> new AtomicLong(0));
        long newDelta = viewCountDelta.get();

        BlogResponseDTO adjustedResponse = BlogMapper.toResponseDTOWithAdjustedViewCount(response, newDelta);
        blogCache.put(blogId, adjustedResponse);

        invalidateUserAndStatusCaches(response.getUserId(), response.getBlogApprovalStatus().toString());
        logger.info("Updated blog cache and relevant list caches invalidated after unlike for blog ID: {}", blogId);

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