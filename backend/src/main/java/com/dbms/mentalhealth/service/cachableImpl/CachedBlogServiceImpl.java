package com.dbms.mentalhealth.service.cachableImpl;

import com.dbms.mentalhealth.dto.blog.request.BlogRequestDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogResponseDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogSummaryDTO;
import com.dbms.mentalhealth.service.BlogService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.context.annotation.Primary;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;
import java.util.logging.Logger;

@Service
public class CachedBlogServiceImpl implements BlogService {

    private final BlogService blogService;
    private static final Logger logger = Logger.getLogger(CachedBlogServiceImpl.class.getName());

    @Autowired
    public CachedBlogServiceImpl(BlogService blogService) {
        this.blogService = blogService;
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "blogCache", key = "#blogId", unless = "#result == null")
    public Optional<BlogResponseDTO> getBlogById(Integer blogId) {
        logger.info("Fetching blog by ID: " + blogId + " from database");
        return blogService.getBlogById(blogId);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "blogCache", key = "'user_' + #userId", unless = "#result == null || #result.isEmpty()")
    public List<BlogSummaryDTO> getBlogsByUser(Integer userId) {
        logger.info("Fetching blogs by user ID: " + userId + " from database");
        return blogService.getBlogsByUser(userId);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "blogCache", key = "'title_' + #title", unless = "#result == null || #result.isEmpty()")
    public List<BlogSummaryDTO> searchBlogsByPartialTitle(String title) {
        logger.info("Searching blogs by title: " + title + " from database");
        return blogService.searchBlogsByPartialTitle(title);
    }

    @Override
    @Transactional(readOnly = true)
    @Cacheable(value = "blogCache", key = "'status_' + #status", unless = "#result == null || #result.isEmpty()")
    public List<BlogSummaryDTO> getBlogsByApprovalStatus(String status) {
        logger.info("Fetching blogs by approval status: " + status + " from database");
        return blogService.getBlogsByApprovalStatus(status);
    }

    @Override
    @CacheEvict(value = "blogCache", key = "#result.id")
    public BlogResponseDTO createBlog(BlogRequestDTO blogRequestDTO, MultipartFile image) throws Exception {
        logger.info("Creating blog with request: " + blogRequestDTO);
        return blogService.createBlog(blogRequestDTO, image);
    }

    @Override
    @CacheEvict(value = "blogCache", key = "#blogId")
    public BlogResponseDTO updateBlog(Integer blogId, BlogRequestDTO blogRequestDTO, MultipartFile image) throws Exception {
        logger.info("Updating blog with ID: " + blogId);
        return blogService.updateBlog(blogId, blogRequestDTO, image);
    }

    @Override
    @CacheEvict(value = "blogCache", key = "#blogId")
    public void deleteBlog(Integer blogId) throws Exception {
        logger.info("Deleting blog with ID: " + blogId);
        blogService.deleteBlog(blogId);
    }

    @Override
    @CacheEvict(value = "blogCache", key = "#blogId")
    public BlogResponseDTO updateBlogApprovalStatus(Integer blogId, boolean isApproved) {
        logger.info("Updating blog approval status for blog ID: " + blogId + " to " + isApproved);
        return blogService.updateBlogApprovalStatus(blogId, isApproved);
    }

    @Override
    @CacheEvict(value = "blogCache", key = "#blogId")
    public BlogResponseDTO likeBlog(Integer blogId) {
        logger.info("Liking blog with ID: " + blogId);
        return blogService.likeBlog(blogId);
    }

    @Override
    @CacheEvict(value = "blogCache", key = "#blogId")
    public BlogResponseDTO unlikeBlog(Integer blogId) {
        logger.info("Unliking blog with ID: " + blogId);
        return blogService.unlikeBlog(blogId);
    }
}