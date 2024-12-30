package com.dbms.mentalhealth.util;

import com.dbms.mentalhealth.config.TrendingScoreConfig;
import com.dbms.mentalhealth.model.Blog;
import com.dbms.mentalhealth.model.BlogTrendingScore;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Component;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;

@Component
@RequiredArgsConstructor
public class TrendingScoreCalculator {
    private final TrendingScoreConfig properties;

    public BlogTrendingScore calculateScore(Blog blog) {
        double hoursAge = ChronoUnit.HOURS.between(
                blog.getCreatedAt(),
                LocalDateTime.now()
        ) + 2; // +2 to avoid division by zero

        double score = (blog.getViewCount() * properties.getViewWeight() +
                blog.getLikeCount() * properties.getLikeWeight()) /
                Math.pow(hoursAge, properties.getDecayFactor());

        return new BlogTrendingScore(
                blog.getId(),
                score,
                blog.getViewCount(),
                blog.getLikeCount(),
                LocalDateTime.now(),
                null  // version will be handled by JPA
        );
    }
}