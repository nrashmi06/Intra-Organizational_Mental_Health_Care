package com.dbms.mentalhealth.dto.blog;
import lombok.Builder;
import lombok.Data;
import java.time.LocalDateTime;

@Data
@Builder
public class TrendingScoreDTO {
    private Integer blogId;
    private double trendingScore;
    private int viewCount;
    private int likeCount;
    private LocalDateTime lastCalculated;
}