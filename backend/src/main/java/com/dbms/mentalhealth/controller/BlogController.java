package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.blog.request.BlogRequestDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogResponseDTO;
import com.dbms.mentalhealth.service.BlogService;
import com.dbms.mentalhealth.urlMapper.blogUrl.BlogUrlMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
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
            @RequestParam("image") MultipartFile image,
            @RequestParam("blog") BlogRequestDTO blogRequestDTO
    ) {
        BlogResponseDTO response = blogService.updateBlog(blogId, blogRequestDTO, image);
        return new ResponseEntity<>(response, HttpStatus.OK);
    }

    @DeleteMapping(BlogUrlMapping.DELETE_BLOG)
    public void deleteBlog(@PathVariable("blogId") Integer blogId) {
        blogService.deleteBlog(blogId);
    }

    @GetMapping(BlogUrlMapping.CHECK_LIKE_STATUS)
    public boolean isBlogLikedByUser(@PathVariable("blogId") Integer blogId, @PathVariable("userId") Integer userId) {
        return blogService.isBlogLikedByUser(blogId, userId);
    }
}
