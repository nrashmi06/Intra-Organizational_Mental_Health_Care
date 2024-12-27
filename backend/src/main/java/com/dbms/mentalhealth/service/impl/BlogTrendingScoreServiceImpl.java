package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.config.TrendingScoreConfig;
import com.dbms.mentalhealth.dto.blog.TrendingScoreDTO;
import com.dbms.mentalhealth.mapper.TrendingScoreMapper;
import com.dbms.mentalhealth.model.Blog;
import com.dbms.mentalhealth.model.BlogTrendingScore;
import com.dbms.mentalhealth.repository.BlogRepository;
import com.dbms.mentalhealth.repository.BlogTrendingScoreRepository;
import com.dbms.mentalhealth.service.BlogTrendingScoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.stream.Collectors;

@Slf4j
@Service
@RequiredArgsConstructor
public class BlogTrendingScoreServiceImpl implements BlogTrendingScoreService {
    private final BlogRepository blogRepository;
    private final BlogTrendingScoreRepository trendingScoreRepository;
    private final TrendingScoreConfig properties;

    @Override
    @Scheduled(fixedRate = 3000000) // Every 5 minutes
    @Transactional
    public void updateScores() {
        LocalDateTime cutoff = LocalDateTime.now().minusHours(properties.getDecayHours());

        try {
            Page<Blog> blogs = blogRepository.findRecentlyActiveBlogs(
                    cutoff,
                    PageRequest.of(0, properties.getBatchSize())
            );

            while (blogs.hasContent()) {
                List<BlogTrendingScore> scores = blogs.getContent().stream()
                        .map(this::calculateScore)
                        .toList();
                for (BlogTrendingScore score : scores) {
                    trendingScoreRepository.findById(score.getBlogId())
                            .ifPresentOrElse(
                                    existingScore -> {
                                        existingScore.setTrendingScore(score.getTrendingScore());
                                        existingScore.setViewCount(score.getViewCount());
                                        existingScore.setLikeCount(score.getLikeCount());
                                        existingScore.setLastCalculated(score.getLastCalculated());
                                        trendingScoreRepository.save(existingScore);
                                    },
                                    () -> trendingScoreRepository.save(score)
                            );
                }

                if (blogs.hasNext()) {
                    blogs = blogRepository.findRecentlyActiveBlogs(
                            cutoff,
                            blogs.nextPageable()
                    );
                } else {
                    break;
                }
            }

            log.info("Successfully updated trending scores");
        } catch (Exception e) {
            log.error("Error updating trending scores", e);
        }
    }

    @Override
    @Transactional
    public void updateScore(Integer blogId) {
        try {
            Blog blog = blogRepository.findById(blogId)
                    .orElseThrow(() -> new RuntimeException("Blog not found: " + blogId));

            BlogTrendingScore score = calculateScore(blog);
            trendingScoreRepository.save(score);

            log.debug("Updated trending score for blog {}", blogId);
        } catch (Exception e) {
            log.error("Error updating trending score for blog {}", blogId, e);
            throw new RuntimeException("Failed to update trending score", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TrendingScoreDTO> getTrendingBlogs(Integer userId, Pageable pageable) {
        return trendingScoreRepository.findTrendingBlogs(userId, pageable)
                .map(TrendingScoreMapper::toDTO);
    }

    @Override
    public void handleBlogView(Integer blogId) {
        updateScore(blogId);
    }

    @Override
    public void handleBlogLike(Integer blogId) {
        updateScore(blogId);
    }

    private BlogTrendingScore calculateScore(Blog blog) {
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