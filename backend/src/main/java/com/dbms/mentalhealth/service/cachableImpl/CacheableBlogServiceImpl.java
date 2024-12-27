//package com.dbms.mentalhealth.service.cachableImpl;
//
//import com.dbms.mentalhealth.dto.blog.request.BlogRequestDTO;
//import com.dbms.mentalhealth.dto.blog.response.BlogResponseDTO;
//import com.dbms.mentalhealth.dto.blog.response.BlogSummaryDTO;
//import com.dbms.mentalhealth.exception.blog.BlogNotFoundException;
//import com.dbms.mentalhealth.security.jwt.JwtUtils;
//import com.dbms.mentalhealth.service.BlogService;
//import com.dbms.mentalhealth.service.impl.BlogServiceImpl;
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
//import java.util.Optional;
//
//@Service
//@Primary
//public class CacheableBlogServiceImpl implements BlogService {
//
//    private final BlogServiceImpl blogServiceImpl;
//    private static final Logger logger = LoggerFactory.getLogger(CacheableBlogServiceImpl.class);
//    private final JwtUtils jwtUtils;
//
//    public CacheableBlogServiceImpl(BlogServiceImpl blogServiceImpl, JwtUtils jwtUtils) {
//        this.blogServiceImpl = blogServiceImpl;
//        this.jwtUtils = jwtUtils;
//        logger.info("CacheableBlogServiceImpl initialized");
//    }
//
//    @Override
//    @Transactional
//    public Optional<BlogResponseDTO> getBlogById(Integer blogId) {
//        return blogServiceImpl.getBlogById(blogId);
//    }
//
//    @Scheduled(fixedRate = 300000) // Every 5 minutes
//    public void flushPendingViewCounts() {
//        // No caching logic needed
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public Page<BlogSummaryDTO> getBlogsByUser(Integer userId, Pageable pageable) {
//        return blogServiceImpl.getBlogsByUser(userId, pageable);
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public Page<BlogSummaryDTO> searchBlogsByPartialTitle(String title, Pageable pageable) {
//        return blogServiceImpl.searchBlogsByPartialTitle(title, pageable);
//    }
//
//    @Override
//    @Transactional(readOnly = true)
//    public Page<BlogSummaryDTO> getBlogsByApprovalStatus(String status, Pageable pageable) {
//        return blogServiceImpl.getBlogsByApprovalStatus(status, pageable);
//    }
//
//    @Override
//    @Transactional
//    public BlogResponseDTO createBlog(BlogRequestDTO blogRequestDTO, MultipartFile image) throws Exception {
//        return blogServiceImpl.createBlog(blogRequestDTO, image);
//    }
//
//    @Override
//    @Transactional
//    public BlogResponseDTO updateBlog(Integer blogId, BlogRequestDTO blogRequestDTO, MultipartFile image) throws Exception {
//        return blogServiceImpl.updateBlog(blogId, blogRequestDTO, image);
//    }
//
//    @Override
//    @Transactional
//    public void deleteBlog(Integer blogId) throws Exception {
//        blogServiceImpl.deleteBlog(blogId);
//    }
//
//    @Override
//    public BlogResponseDTO updateBlogApprovalStatus(Integer blogId, boolean isApproved) {
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
//    public void logCacheStats() {
//        // No caching logic needed
//    }
//}