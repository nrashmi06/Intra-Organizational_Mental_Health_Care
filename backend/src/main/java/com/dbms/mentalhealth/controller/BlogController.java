// BlogController.java
package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.blog.TrendingBlogSummaryDTO;
import com.dbms.mentalhealth.dto.blog.request.BlogRequestDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogResponseDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogSummaryDTO;
import com.dbms.mentalhealth.enums.BlogFilterType;
import com.dbms.mentalhealth.service.BlogService;
import com.dbms.mentalhealth.urlMapper.BlogUrlMapping;
import com.dbms.mentalhealth.util.BlogETagGenerator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.HttpHeaders;
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
    private final BlogETagGenerator eTagGenerator;

    public BlogController(BlogService blogService, BlogETagGenerator eTagGenerator) {
        this.blogService = blogService;
        this.eTagGenerator = eTagGenerator;
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping(value = BlogUrlMapping.CREATE_BLOG, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BlogResponseDTO> createBlog(
            @RequestPart("image") MultipartFile image,
            @RequestPart("blog") BlogRequestDTO blogRequestDTO
    ) throws Exception {
        BlogResponseDTO response = blogService.createBlog(blogRequestDTO, image);
        String eTag = eTagGenerator.generateBlogETag(response);
        return ResponseEntity.status(HttpStatus.CREATED)
                .header(HttpHeaders.ETAG, eTag)
                .body(response);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping(BlogUrlMapping.GET_BLOG_BY_ID)
    public ResponseEntity<BlogResponseDTO> getBlogById(
            @PathVariable("blogId") Integer blogId,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch
    ) {
        Optional<BlogResponseDTO> blogOptional = blogService.getBlogById(blogId);
        BlogResponseDTO blog = blogOptional.orElseThrow();

        String eTag = eTagGenerator.generateBlogETag(blog);
        if (ifNoneMatch != null && !ifNoneMatch.isEmpty() && eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .header(HttpHeaders.ETAG, eTag)
                    .build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(blog);
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping(value = BlogUrlMapping.UPDATE_BLOG, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<BlogResponseDTO> updateBlog(
            @PathVariable("blogId") Integer blogId,
            @RequestPart(value = "image", required = false) MultipartFile image,
            @RequestPart("blog") BlogRequestDTO blogRequestDTO
    ) throws Exception {
        BlogResponseDTO response = blogService.updateBlog(blogId, blogRequestDTO, image);
        String eTag = eTagGenerator.generateBlogETag(response);
        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(response);
    }

    @PreAuthorize("isAuthenticated()")
    @DeleteMapping(BlogUrlMapping.DELETE_BLOG)
    public ResponseEntity<Void> deleteBlog(@PathVariable("blogId") Integer blogId) throws Exception {
        blogService.deleteBlog(blogId);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping(BlogUrlMapping.LIKE_UNLIKE_BLOG)
    public ResponseEntity<BlogResponseDTO> likeOrUnlikeBlog(
            @PathVariable Integer blogId,
            @RequestParam("action") String action,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch
    ) {
        BlogResponseDTO response = "like".equalsIgnoreCase(action) ?
                blogService.likeBlog(blogId) :
                blogService.unlikeBlog(blogId);

        String eTag = eTagGenerator.generateBlogETag(response);

        if (ifNoneMatch != null && !ifNoneMatch.isEmpty() && eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .header(HttpHeaders.ETAG, eTag)
                    .build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(response);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping(BlogUrlMapping.UPDATE_BLOG_APPROVAL_STATUS)
    public ResponseEntity<BlogResponseDTO> updateBlogApprovalStatus(
            @PathVariable("blogId") Integer blogId,
            @RequestParam("isApproved") boolean isApproved,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch
    ) {
        BlogResponseDTO response = blogService.updateBlogApprovalStatus(blogId, isApproved);
        String eTag = eTagGenerator.generateBlogETag(response);

        if (ifNoneMatch != null && !ifNoneMatch.isEmpty() && eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .header(HttpHeaders.ETAG, eTag)
                    .build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(response);
    }

    @GetMapping(BlogUrlMapping.FILTER_BLOGS)
    public ResponseEntity<Page<BlogSummaryDTO>> filterBlogs(
            @RequestParam(required = false) Integer userId,
            @RequestParam(defaultValue = "", required = false) String title,
            @RequestParam(required = false) BlogFilterType filterType,
            @RequestParam(defaultValue = "0") int page,
            @RequestParam(defaultValue = "10") int size,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch
    ) {
        filterType = filterType == null ? BlogFilterType.RECENT : filterType;
        String sortBy = switch (filterType) {
            case RECENT -> "publishDate";
            case MOST_VIEWED -> "viewCount";
            case MOST_LIKED -> "likeCount";
            default -> "createdAt";
        };

        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, sortBy));
        Page<BlogSummaryDTO> blogs = blogService.filterBlogs(userId, title, pageable);

        String eTag = eTagGenerator.generatePageETag(blogs);

        if (ifNoneMatch != null && !ifNoneMatch.isEmpty() && eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .header(HttpHeaders.ETAG, eTag)
                    .build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(blogs);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping(BlogUrlMapping.GET_BLOGS_BY_APPROVAL_STATUS)
    public ResponseEntity<Page<BlogSummaryDTO>> getBlogsByApprovalStatus(
            @RequestParam String status,
            Pageable pageable,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch
    ) {
        Page<BlogSummaryDTO> blogs = blogService.getBlogsByApprovalStatus(status, pageable);
        String eTag = eTagGenerator.generatePageETag(blogs);

        if (ifNoneMatch != null && !ifNoneMatch.isEmpty() && eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .header(HttpHeaders.ETAG, eTag)
                    .build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(blogs);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping(BlogUrlMapping.GET_TRENDING_BLOGS)
    public ResponseEntity<Page<TrendingBlogSummaryDTO>> getTrendingBlogs(
            @RequestParam(required = false) Integer userId,
            @RequestParam(required = false, defaultValue = "") String title,
            Pageable pageable,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch
    ) {
        Page<TrendingBlogSummaryDTO> blogs = blogService.getTrendingBlogs(userId, title, pageable);
        String eTag = eTagGenerator.generatePageETag(blogs);

        if (ifNoneMatch != null && !ifNoneMatch.isEmpty() && eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .header(HttpHeaders.ETAG, eTag)
                    .build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(blogs);
    }
}