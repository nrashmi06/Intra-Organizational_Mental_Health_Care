// TrendingBlogSummaryDTO.java
package com.dbms.mentalhealth.dto.blog.trending;

import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TrendingBlogSummaryDTO {
    private Integer id;
    private String title;
    private String summary;
    private String content;
    private String imageUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private boolean likedByCurrentUser;
    private double trendingScore;
}