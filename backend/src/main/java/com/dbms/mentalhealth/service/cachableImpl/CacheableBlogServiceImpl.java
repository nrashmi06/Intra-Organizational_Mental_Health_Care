package com.dbms.mentalhealth.service.cachableImpl;

import com.dbms.mentalhealth.dto.blog.request.BlogRequestDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogResponseDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogSummaryDTO;
import com.dbms.mentalhealth.service.BlogService;
import com.dbms.mentalhealth.service.impl.BlogServiceImpl;
import com.github.benmanes.caffeine.cache.Cache;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
@Primary
public class CacheableBlogServiceImpl implements BlogService {

    private final BlogServiceImpl blogServiceImpl;
    private final Cache<Integer, BlogResponseDTO> blogCache;
    private final Cache<String, List<BlogSummaryDTO>> blogListCache;
    private static final Logger logger = Logger.getLogger(CacheableBlogServiceImpl.class.getName());

    public CacheableBlogServiceImpl(BlogServiceImpl blogServiceImpl, Cache<Integer, BlogResponseDTO> blogCache, Cache<String, List<BlogSummaryDTO>> blogListCache) {
        this.blogServiceImpl = blogServiceImpl;
        this.blogCache = blogCache;
        this.blogListCache = blogListCache;
        logger.info("CacheableBlogServiceImpl initialized with cache stats enabled");
    }

    @Override
    @Transactional(readOnly = true)
    public Optional<BlogResponseDTO> getBlogById(Integer blogId) {
        logger.info("Cache lookup for blog ID: " + blogId);
        BlogResponseDTO cachedBlog = blogCache.getIfPresent(blogId);

        if (cachedBlog != null) {
            logger.info("Cache HIT - Returning cached blog for ID: " + blogId);
            return Optional.of(cachedBlog);
        }

        logger.info("Cache MISS - Fetching blog from database for ID: " + blogId);
        Optional<BlogResponseDTO> response = blogServiceImpl.getBlogById(blogId);

        if (response.isPresent()) {
            logger.info("Caching blog with ID: " + blogId);
            blogCache.put(blogId, response.get());
        }

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<BlogSummaryDTO> getBlogsByUser(Integer userId) {
        String cacheKey = "user_" + userId;
        logger.info("Cache lookup for user blogs with key: " + cacheKey);

        List<BlogSummaryDTO> cachedBlogs = blogListCache.getIfPresent(cacheKey);
        if (cachedBlogs != null) {
            logger.info("Cache HIT - Returning cached blogs for user ID: " + userId);
            return cachedBlogs;
        }

        logger.info("Cache MISS - Fetching blogs from database for user ID: " + userId);
        List<BlogSummaryDTO> response = blogServiceImpl.getBlogsByUser(userId);
        blogListCache.put(cacheKey, response);
        logger.info("Cached " + response.size() + " blogs for user ID: " + userId);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<BlogSummaryDTO> searchBlogsByPartialTitle(String title) {
        String cacheKey = "search_" + title.toLowerCase();
        logger.info("Cache lookup for search with key: " + cacheKey);

        List<BlogSummaryDTO> cachedBlogs = blogListCache.getIfPresent(cacheKey);
        if (cachedBlogs != null) {
            logger.info("Cache HIT - Returning cached search results for: " + title);
            return cachedBlogs;
        }

        logger.info("Cache MISS - Performing database search for: " + title);
        List<BlogSummaryDTO> response = blogServiceImpl.searchBlogsByPartialTitle(title);
        blogListCache.put(cacheKey, response);
        logger.info("Cached " + response.size() + " search results for: " + title);

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public List<BlogSummaryDTO> getBlogsByApprovalStatus(String status) {
        String cacheKey = "status_" + status.toLowerCase();
        logger.info("Cache lookup for approval status with key: " + cacheKey);

        List<BlogSummaryDTO> cachedBlogs = blogListCache.getIfPresent(cacheKey);
        if (cachedBlogs != null) {
            logger.info("Cache HIT - Returning cached blogs for status: " + status);
            return cachedBlogs;
        }

        logger.info("Cache MISS - Fetching blogs from database for status: " + status);
        List<BlogSummaryDTO> response = blogServiceImpl.getBlogsByApprovalStatus(status);
        blogListCache.put(cacheKey, response);
        logger.info("Cached " + response.size() + " blogs for status: " + status);

        return response;
    }

    @Override
    @Transactional
    public BlogResponseDTO createBlog(BlogRequestDTO blogRequestDTO, MultipartFile image) throws Exception {
        logger.info("Creating new blog - invalidating all caches");
        BlogResponseDTO response = blogServiceImpl.createBlog(blogRequestDTO, image);
        blogCache.invalidateAll();
        blogListCache.invalidateAll();
        logger.info("All caches invalidated after blog creation");
        return response;
    }

    @Override
    @Transactional
    public BlogResponseDTO updateBlog(Integer blogId, BlogRequestDTO blogRequestDTO, MultipartFile image) throws Exception {
        logger.info("Updating blog ID: " + blogId + " - updating caches");
        BlogResponseDTO response = blogServiceImpl.updateBlog(blogId, blogRequestDTO, image);
        blogCache.put(blogId, response);
        blogListCache.invalidateAll();
        logger.info("Blog cache updated and list cache invalidated for blog ID: " + blogId);
        return response;
    }

    @Override
    @Transactional
    public void deleteBlog(Integer blogId) throws Exception {
        logger.info("Deleting blog ID: " + blogId + " - removing from caches");
        blogServiceImpl.deleteBlog(blogId);
        blogCache.invalidate(blogId);
        blogListCache.invalidateAll();
        logger.info("Blog removed from cache and list cache invalidated for blog ID: " + blogId);
    }

    @Override
    public BlogResponseDTO updateBlogApprovalStatus(Integer blogId, boolean isApproved) {
        logger.info("Updating approval status for blog ID: " + blogId + " to " + isApproved);

        BlogResponseDTO response = blogServiceImpl.updateBlogApprovalStatus(blogId, isApproved);

        blogCache.put(blogId, response);
        blogListCache.invalidateAll();
        logger.info("Updated blog cache and invalidated list cache after approval status change for blog ID: " + blogId);

        return response;
    }

    @Override
    public BlogResponseDTO likeBlog(Integer blogId) {
        logger.info("Processing like for blog ID: " + blogId);

        BlogResponseDTO response = blogServiceImpl.likeBlog(blogId);

        blogCache.put(blogId, response);
        blogListCache.invalidateAll();
        logger.info("Updated blog cache and invalidated list cache after like for blog ID: " + blogId);

        return response;
    }

    @Override
    public BlogResponseDTO unlikeBlog(Integer blogId) {
        logger.info("Processing unlike for blog ID: " + blogId);

        BlogResponseDTO response = blogServiceImpl.unlikeBlog(blogId);

        blogCache.put(blogId, response);
        blogListCache.invalidateAll();
        logger.info("Updated blog cache and invalidated list cache after unlike for blog ID: " + blogId);

        return response;
    }

    public void logCacheStats() {
        logger.info("Current Cache Statistics:");
        logger.info("Blog Cache - Size: " + blogCache.estimatedSize());
        logger.info("Blog List Cache - Size: " + blogListCache.estimatedSize());
    }
}