package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.blog.trending.TrendingScoreDTO;
import com.dbms.mentalhealth.mapper.TrendingScoreMapper;
import com.dbms.mentalhealth.model.Blog;
import com.dbms.mentalhealth.model.BlogTrendingScore;
import com.dbms.mentalhealth.repository.BlogRepository;
import com.dbms.mentalhealth.repository.BlogTrendingScoreRepository;
import com.dbms.mentalhealth.scheduler.TrendingScoreScheduler;
import com.dbms.mentalhealth.service.BlogTrendingScoreService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Slf4j
@Service
@RequiredArgsConstructor
public class BlogTrendingScoreServiceImpl implements BlogTrendingScoreService {
    private final BlogRepository blogRepository;
    private final BlogTrendingScoreRepository trendingScoreRepository;
    private final TrendingScoreScheduler trendingScoreScheduler;

    @Override
    @Transactional
    public void updateScore(Integer blogId) {
        try {
            Blog blog = blogRepository.findById(blogId)
                    .orElseThrow(() -> new RuntimeException("Blog not found: " + blogId));
            trendingScoreScheduler.updateTrendingScores();
            log.debug("Updated trending score for blog {}", blogId);
        } catch (Exception e) {
            log.error("Error updating trending score for blog {}", blogId, e);
            throw new RuntimeException("Failed to update trending score", e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public Page<TrendingScoreDTO> getTrendingBlogs(Integer userId, String title, Pageable pageable) {
        return trendingScoreRepository.findTrendingBlogs(userId, title, pageable)
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
}