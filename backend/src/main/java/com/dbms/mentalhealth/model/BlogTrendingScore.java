package com.dbms.mentalhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "blog_trending_scores", indexes = {
        @Index(name = "idx_trending_score", columnList = "trending_score"),
        @Index(name = "idx_last_calculated", columnList = "last_calculated")
})
@Data
@NoArgsConstructor
@AllArgsConstructor
public class BlogTrendingScore {
    @Id
    @Column(name = "blog_id", nullable = false)
    private Integer blogId;

    @Column(name = "trending_score", nullable = false)
    private Double trendingScore;

    @Column(name = "view_count", nullable = false)
    private Integer viewCount;

    @Column(name = "like_count", nullable = false)
    private Integer likeCount;

    @Column(name = "last_calculated", nullable = false)
    private LocalDateTime lastCalculated;

    @Version
    @Column(name = "version", nullable = false)
    private Long version;
}