package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.blog.TrendingBlogSummaryDTO;
import com.dbms.mentalhealth.dto.blog.request.BlogRequestDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogResponseDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogSummaryDTO;
import com.dbms.mentalhealth.enums.BlogFilterType;
import com.dbms.mentalhealth.exception.blog.BlogNotFoundException;
import com.dbms.mentalhealth.exception.blog.InvalidBlogActionException;
import com.dbms.mentalhealth.service.BlogService;
import com.dbms.mentalhealth.urlMapper.BlogUrlMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Optional;

@RestController
public class BlogController {
    private final BlogService blogService;

    @Autowired
    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping(value = BlogUrlMapping.CREATE_BLOG, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BlogResponseDTO> createBlog(
            @RequestPart("image") MultipartFile image,
            @RequestPart("blog") BlogRequestDTO blogRequestDTO
    ) throws Exception {
        try {
            BlogResponseDTO response = blogService.createBlog(blogRequestDTO, image);
            return new ResponseEntity<>(response, HttpStatus.CREATED);
        } catch (InvalidBlogActionException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping(BlogUrlMapping.GET_BLOG_BY_ID)
    public ResponseEntity<BlogResponseDTO> getBlogById(@PathVariable("blogId") Integer blogId) {
        try {
            Optional<BlogResponseDTO> blogResponseDTO = blogService.getBlogById(blogId);
            return blogResponseDTO.map(ResponseEntity::ok)
                    .orElseThrow(() -> new BlogNotFoundException("Blog not found with ID: " + blogId));
        } catch (BlogNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping(value = BlogUrlMapping.UPDATE_BLOG, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BlogResponseDTO> updateBlog(
            @PathVariable("blogId") Integer blogId,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart("blog") BlogRequestDTO blogRequestDTO
    ) throws Exception {
        try {
            BlogResponseDTO response = blogService.updateBlog(blogId, blogRequestDTO, image);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (BlogNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (InvalidBlogActionException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping(BlogUrlMapping.DELETE_BLOG)
    public ResponseEntity<String> deleteBlog(@PathVariable("blogId") Integer blogId) {
        try {
            blogService.deleteBlog(blogId);
            return ResponseEntity.noContent().build();
        } catch (BlogNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping(BlogUrlMapping.LIKE_UNLIKE_BLOG)
    public ResponseEntity<BlogResponseDTO> likeOrUnlikeBlog(@PathVariable Integer blogId, @RequestParam("action") String action) {
        try {
            BlogResponseDTO response;
            if ("like".equalsIgnoreCase(action)) {
                response = blogService.likeBlog(blogId);
            } else if ("unlike".equalsIgnoreCase(action)) {
                response = blogService.unlikeBlog(blogId);
            } else {
                throw new InvalidBlogActionException("Invalid action: " + action);
            }
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (BlogNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (InvalidBlogActionException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping(BlogUrlMapping.UPDATE_BLOG_APPROVAL_STATUS)
    public ResponseEntity<BlogResponseDTO> updateBlogApprovalStatus(
            @PathVariable("blogId") Integer blogId,
            @RequestParam("isApproved") boolean isApproved) {
        try {
            BlogResponseDTO response = blogService.updateBlogApprovalStatus(blogId, isApproved);
            return new ResponseEntity<>(response, HttpStatus.OK);
        } catch (BlogNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }


    @GetMapping(BlogUrlMapping.FILTER_BLOGS)
    public Page<BlogSummaryDTO> filterBlogs(
            @RequestParam(required = false) Integer userId,
            @RequestParam(defaultValue = "", required = false) String title,
            @RequestParam(required = false) BlogFilterType filterType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size) {
        if (filterType == null) {
            filterType = BlogFilterType.RECENT;
        }
        String sortBy = switch (filterType) {
            case RECENT -> "publishDate";
            case MOST_VIEWED -> "viewCount";
            case MOST_LIKED -> "likeCount";
            default -> "createdAt";
        };

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortBy));
        return blogService.filterBlogs(userId, title, pageable);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping(BlogUrlMapping.GET_BLOGS_BY_APPROVAL_STATUS)
    public Page<BlogSummaryDTO> getBlogsByApprovalStatus(
            @RequestParam String status,
            Pageable pageable) {
        return blogService.getBlogsByApprovalStatus(status, pageable);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping(BlogUrlMapping.GET_TRENDING_BLOGS)
    public Page<TrendingBlogSummaryDTO> getTrendingBlogs(
            @RequestParam(required = false) Integer userId,
            @RequestParam(required = false,defaultValue = "") String title,
            Pageable pageable) {
        return blogService.getTrendingBlogs(userId, title, pageable);
    }
}