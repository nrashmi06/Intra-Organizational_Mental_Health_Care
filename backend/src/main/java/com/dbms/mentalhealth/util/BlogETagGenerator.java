// BlogETagGenerator.java
package com.dbms.mentalhealth.util;

import com.dbms.mentalhealth.dto.blog.TrendingBlogSummaryDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogResponseDTO;
import com.dbms.mentalhealth.dto.blog.response.BlogSummaryDTO;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

import java.util.Objects;
import java.util.stream.Collectors;

/**
 * Generates ETags for blog resources to support caching and conditional requests.
 * ETags are unique identifiers that change when the resource content changes.
 */
@Component
public class BlogETagGenerator {
    private static final String BLOG_TAG_FORMAT = "blog-%d-%d-%d-%s"; // blogId-likeCount-viewCount-updatedAt
    private static final String LIST_TAG_FORMAT = "blog-list-%d-%d"; // size-hash
    private static final String PAGE_TAG_FORMAT = "blog-page-%d-%d-%d-%d"; // pageNumber-pageSize-totalElements-contentHash

    /**
     * Generates an ETag for a single blog.
     */
    public String generateBlogETag(BlogResponseDTO blog) {
        validateBlog(blog);

        return String.format(BLOG_TAG_FORMAT,
                blog.getPostId(),
                blog.getLikeCount(),
                blog.getViewCount(),
                blog.getUpdatedAt().toString()
        );
    }

    /**
     * Generates an ETag for a page of blog summaries.
     */
    public String generatePageETag(Page<?> page) {
        if (page == null) {
            throw new IllegalArgumentException("Page cannot be null");
        }

        String contentFingerprint = page.getContent().stream()
                .filter(Objects::nonNull)
                .map(this::generateContentFingerprint)
                .sorted()
                .collect(Collectors.joining());

        int contentHash = Objects.hash(contentFingerprint);

        return String.format(PAGE_TAG_FORMAT,
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                contentHash
        );
    }

    /**
     * Generates a content fingerprint based on the type of blog DTO
     */
    private String generateContentFingerprint(Object dto) {
        if (dto instanceof BlogSummaryDTO summary) {
            return String.format("%d-%s-%d-%b",
                    summary.getId(),
                    summary.getTitle(),
                    summary.getLikeCount(),
                    summary.isLikedByCurrentUser()
            );
        } else if (dto instanceof TrendingBlogSummaryDTO trending) {
            return String.format("%d-%s-%s-%f-%b",
                    trending.getId(),
                    trending.getTitle(),
                    trending.getUpdatedAt().toString(),
                    trending.getTrendingScore(),
                    trending.isLikedByCurrentUser()
            );
        }
        return dto.toString();
    }

    private void validateBlog(BlogResponseDTO blog) {
        if (blog == null) {
            throw new IllegalArgumentException("Blog cannot be null");
        }
        if (blog.getPostId() == null) {
            throw new IllegalArgumentException("Blog ID cannot be null");
        }
        if (blog.getUpdatedAt() == null) {
            throw new IllegalArgumentException("Updated timestamp cannot be null");
        }
    }
}