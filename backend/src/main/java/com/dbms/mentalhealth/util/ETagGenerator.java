package com.dbms.mentalhealth.utils;

import com.dbms.mentalhealth.dto.blog.response.BlogResponseDTO;
import com.dbms.mentalhealth.dto.blog.TrendingBlogSummaryDTO;
import org.springframework.data.domain.Page;
import org.springframework.stereotype.Component;

@Component
public class ETagGenerator {

    public String generateBlogETag(BlogResponseDTO blog) {
        return String.format("blog-%d-l%d-v%d",
                blog.getPostId(),
                blog.getLikeCount(),
                blog.getViewCount());
    }

    public String generateListETag(Page<?> page) {
        return String.format("page-%d-size-%d-total-%d-hash-%d",
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getContent().hashCode());
    }

    public String generateTrendingETag(Page<TrendingBlogSummaryDTO> page) {
        // Change hash every minute for trending content
        return String.format("trending-%d-%d-%d",
                page.getNumber(),
                System.currentTimeMillis() / (60 * 1000),
                page.getContent().hashCode());
    }
}