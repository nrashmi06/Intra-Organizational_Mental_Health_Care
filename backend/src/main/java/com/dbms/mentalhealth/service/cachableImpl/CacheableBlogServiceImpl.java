//package com.dbms.mentalhealth.service.cachableImpl;
//import com.dbms.mentalhealth.dto.blog.request.BlogRequestDTO;
//import com.dbms.mentalhealth.dto.blog.response.BlogResponseDTO;
//import com.dbms.mentalhealth.dto.blog.response.BlogSummaryDTO;
//import com.dbms.mentalhealth.dto.blog.TrendingBlogSummaryDTO;
//import com.dbms.mentalhealth.security.jwt.JwtUtils;
//import com.dbms.mentalhealth.service.BlogService;
//import com.dbms.mentalhealth.service.impl.BlogServiceImpl;
//import com.github.benmanes.caffeine.cache.Cache;
//import org.springframework.context.annotation.Primary;
//import org.springframework.data.domain.Page;
//import org.springframework.data.domain.Pageable;
//import org.springframework.scheduling.annotation.Scheduled;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//import org.springframework.web.multipart.MultipartFile;
//import org.slf4j.Logger;
//import org.slf4j.LoggerFactory;
//
//import java.util.List;
//import java.util.Optional;
//
//@Service
//@Primary
//public class CacheableBlogServiceImpl implements BlogService {
//    private static final Logger logger = LoggerFactory.getLogger(CacheableBlogServiceImpl.class);
//    private final BlogServiceImpl blogServiceImpl;
//    private final JwtUtils jwtUtils;
//    private final Cache<String, Page<BlogSummaryDTO>> blogPageCache;
//    private final Cache<String, Page<TrendingBlogSummaryDTO>> trendingBlogPageCache;
//
//    public CacheableBlogServiceImpl(
//            BlogServiceImpl blogServiceImpl,
//            JwtUtils jwtUtils,
//            Cache<String, Page<BlogSummaryDTO>> blogPageCache,
//            Cache<String, Page<TrendingBlogSummaryDTO>> trendingBlogPageCache) {
//        this.blogServiceImpl = blogServiceImpl;
//        this.jwtUtils = jwtUtils;
//        this.blogPageCache = blogPageCache;
//        this.trendingBlogPageCache = trendingBlogPageCache;
//        logger.info("CacheableBlogServiceImpl initialized");
//    }
//
//    private String generatePageCacheKey(String status, Pageable pageable, Integer userId) {
//        return String.format("blogs:%s:user:%d:page:%d:size:%d:sort:%s",
//                status, userId, pageable.getPageNumber(),
//                pageable.getPageSize(), pageable.getSort().toString());
//    }
//
//    private String generateTrendingPageCacheKey(Integer userId, Pageable pageable) {
//        return String.format("blogs:trending:userId:%s:page:%d:size:%d:sort:%s",
//                userId,
//                pageable.getPageNumber(),
//                pageable.getPageSize(),
//                pageable.getSort().toString());
//    }
//
//    private void invalidateAllCaches() {
//        blogPageCache.invalidateAll();
//        trendingBlogPageCache.invalidateAll();
//
//        logger.debug("All blog caches invalidated");
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public Page<BlogSummaryDTO> getBlogsByApprovalStatus(String status, Pageable pageable) {
//        String cacheKey = generatePageCacheKey(status, pageable);
//        Page<BlogSummaryDTO> cachedPage = blogPageCache.getIfPresent(cacheKey);
//
//        if (cachedPage != null) {
//            logger.debug("Cache hit for key: {}", cacheKey);
//            return cachedPage;
//        }
//
//        Page<BlogSummaryDTO> page = blogServiceImpl.getBlogsByApprovalStatus(status, pageable);
//        blogPageCache.put(cacheKey, page);
//        logger.debug("Cache miss for key: {}, data cached", cacheKey);
//        return page;
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public Page<TrendingBlogSummaryDTO> getTrendingBlogs(Integer userId, Pageable pageable) {
//        String cacheKey = generateTrendingPageCacheKey(userId, pageable);
//        Page<TrendingBlogSummaryDTO> cachedPage = trendingBlogPageCache.getIfPresent(cacheKey);
//
//        if (cachedPage != null) {
//            logger.debug("Cache hit for trending blogs key: {}", cacheKey);
//            return cachedPage;
//        }
//
//        Page<TrendingBlogSummaryDTO> page = blogServiceImpl.getTrendingBlogs(userId, pageable);
//        trendingBlogPageCache.put(cacheKey, page);
//        logger.debug("Cache miss for trending blogs key: {}, data cached", cacheKey);
//        return page;
//    }
//
//    @Override
//    @Transactional
//    public Optional<BlogResponseDTO> getBlogById(Integer blogId) {
//        return blogServiceImpl.getBlogById(blogId);
//    }
//
//    @Override
//    @Transactional
//    public BlogResponseDTO createBlog(BlogRequestDTO blogRequestDTO, MultipartFile image) throws Exception {
//        BlogResponseDTO createdBlog = blogServiceImpl.createBlog(blogRequestDTO, image);
//        invalidateAllCaches();
//        return createdBlog;
//    }
//
//    @Override
//    @Transactional
//    public BlogResponseDTO updateBlog(Integer blogId, BlogRequestDTO blogRequestDTO, MultipartFile image) throws Exception {
//        BlogResponseDTO updatedBlog = blogServiceImpl.updateBlog(blogId, blogRequestDTO, image);
//        invalidateAllCaches();
//        return updatedBlog;
//    }
//
//    @Override
//    @Transactional
//    public void deleteBlog(Integer blogId) throws Exception {
//        blogServiceImpl.deleteBlog(blogId);
//        invalidateAllCaches();
//    }
//
//    @Override
//    public BlogResponseDTO updateBlogApprovalStatus(Integer blogId, boolean isApproved) {
//
//        return blogServiceImpl.updateBlogApprovalStatus(blogId, isApproved);
//    }
//
//    @Override
//    public BlogResponseDTO likeBlog(Integer blogId) {
//        return blogServiceImpl.likeBlog(blogId);
//    }
//
//    @Override
//    public BlogResponseDTO unlikeBlog(Integer blogId) {
//        return blogServiceImpl.unlikeBlog(blogId);
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public Page<BlogSummaryDTO> filterBlogs(Integer userId, String title, Pageable pageable) {
//        // Don't cache filtered results as they're likely to be more dynamic
//        return blogServiceImpl.filterBlogs(userId, title, pageable);
//    }
//
//    @Override
//    public void incrementViewCountByAmount(Integer blogId, Integer amount) {
//        blogServiceImpl.incrementViewCountByAmount(blogId, amount);
//    }
//
//    @Scheduled(fixedRate = 300000) // Every 5 minutes
//    public void flushPendingViewCounts() {
//        // Implement view count flushing if needed
//    }
//
//    public void logCacheStats() {
//        logger.info("Blog Page Cache Stats: {}", blogPageCache.stats());
//        logger.info("Trending Blog Page Cache Stats: {}", trendingBlogPageCache.stats());
//    }
//}