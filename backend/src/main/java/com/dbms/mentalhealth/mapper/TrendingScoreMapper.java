package com.dbms.mentalhealth.mapper;

import com.dbms.mentalhealth.dto.blog.trending.TrendingBlogSummaryDTO;
import com.dbms.mentalhealth.dto.blog.trending.TrendingScoreDTO;
import com.dbms.mentalhealth.model.Blog;
import com.dbms.mentalhealth.model.BlogTrendingScore;

public class TrendingScoreMapper {

    public static TrendingScoreDTO toDTO(BlogTrendingScore score) {
        return TrendingScoreDTO.builder()
                .id(score.getBlogId())
                .trendingScore(score.getTrendingScore())
                .viewCount(score.getViewCount())
                .likeCount(score.getLikeCount())
                .lastCalculated(score.getLastCalculated())
                .build();
    }

    public static BlogTrendingScore toEntity(TrendingScoreDTO dto) {
        return new BlogTrendingScore(
                dto.getId(),
                dto.getTrendingScore(),
                dto.getViewCount(),
                dto.getLikeCount(),
                dto.getLastCalculated(),
                null  // version will be handled by JPA
        );
    }
    public static TrendingBlogSummaryDTO toTrendingSummaryDTO(Blog blog, BlogTrendingScore score, boolean likedByCurrentUser) {
        return TrendingBlogSummaryDTO.builder()
                .id(blog.getId())
                .title(blog.getTitle())
                .summary(blog.getSummary())
                .content(blog.getContent())
                .imageUrl(blog.getImageUrl())
                .createdAt(blog.getCreatedAt())
                .updatedAt(blog.getUpdatedAt())
                .likedByCurrentUser(likedByCurrentUser)
                .trendingScore(score.getTrendingScore())
                .build();
    }
}