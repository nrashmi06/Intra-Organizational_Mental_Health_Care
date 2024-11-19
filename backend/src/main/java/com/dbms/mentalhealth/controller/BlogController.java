package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.blog.request.BlogRequestDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogResponseDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogSummaryDTO;
import com.dbms.mentalhealth.service.BlogService;
import com.dbms.mentalhealth.urlMapper.blogUrl.BlogUrlMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Optional;

@RestController
public class BlogController {
    private final BlogService blogService;


    @Autowired
    public BlogController(BlogService blogService) {
        this.blogService = blogService;
    }

    @PostMapping(value = BlogUrlMapping.CREATE_BLOG, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BlogResponseDTO> createBlog(
            @RequestPart("image") MultipartFile image,
            @RequestPart("blog") BlogRequestDTO blogRequestDTO
    ) {
        BlogResponseDTO response = blogService.createBlog(blogRequestDTO, image);
        return new ResponseEntity<>(response, HttpStatus.CREATED);
    }

    @GetMapping(BlogUrlMapping.GET_BLOG_BY_ID)
    public ResponseEntity<BlogResponseDTO> getBlogById(@PathVariable("blogId") Integer blogId) {
        Optional<BlogResponseDTO> blogResponseDTO = blogService.getBlogById(blogId);
        return blogResponseDTO.map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.status(HttpStatus.NOT_FOUND).build());
    }

    @PutMapping(value = BlogUrlMapping.UPDATE_BLOG, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BlogResponseDTO> updateBlog(
            @PathVariable("blogId") Integer blogId,
            @RequestPart("image") MultipartFile image,
            @RequestPart("blog") BlogRequestDTO blogRequestDTO
    ) {
        BlogResponseDTO response = blogService.updateBlog(blogId, blogRequestDTO, image);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping(BlogUrlMapping.DELETE_BLOG)
    public void deleteBlog(@PathVariable("blogId") Integer blogId) {
        blogService.deleteBlog(blogId);
    }

    @PostMapping(BlogUrlMapping.LIKE_UNLIKE_BLOG)
    public ResponseEntity<BlogResponseDTO> likeOrUnlikeBlog(@PathVariable Integer blogId, @RequestParam("action") String action) {
        BlogResponseDTO response;
        if ("like".equalsIgnoreCase(action)) {
            response = blogService.likeBlog(blogId);
        } else if ("unlike".equalsIgnoreCase(action)) {
            response = blogService.unlikeBlog(blogId);
        } else {
            throw new IllegalArgumentException("Invalid action: " + action);
        }
        return new ResponseEntity<>(response, HttpStatus.OK);
    }


    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping(BlogUrlMapping.UPDATE_BLOG_APPROVAL_STATUS)
    public ResponseEntity<BlogResponseDTO> updateBlogApprovalStatus(
            @PathVariable("blogId") Integer blogId,
            @RequestParam("isApproved") boolean isApproved) {
        BlogResponseDTO response = blogService.updateBlogApprovalStatus(blogId, isApproved);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping(BlogUrlMapping.GET_BLOGS_BY_USER)
    public ResponseEntity<Iterable<BlogSummaryDTO>> getBlogsByUser(@PathVariable Integer userId) {
        Iterable<BlogSummaryDTO> response = blogService.getBlogsByUser(userId);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping(BlogUrlMapping.SEARCH_BLOGS_BY_PARTIAL_TITLE)
    public ResponseEntity<Iterable<BlogSummaryDTO>> searchBlogsByPartialTitle(@RequestParam("title") String title) {
        Iterable<BlogSummaryDTO> response = blogService.searchBlogsByPartialTitle(title);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @GetMapping(BlogUrlMapping.GET_BLOGS_BY_APPROVAL_STATUS)
    public ResponseEntity<List<BlogSummaryDTO>> getBlogsByApprovalStatus(@RequestParam("status") String status) {
        List<BlogSummaryDTO> response = blogService.getBlogsByApprovalStatus(status);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

}
