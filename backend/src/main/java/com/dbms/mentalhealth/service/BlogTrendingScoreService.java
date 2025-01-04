package com.dbms.mentalhealth.service;


import com.dbms.mentalhealth.dto.blog.trending.TrendingScoreDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface BlogTrendingScoreService {
    void updateScore(Integer blogId);
    Page<TrendingScoreDTO> getTrendingBlogs(Integer userId, String title, Pageable pageable);
    void handleBlogView(Integer blogId);
    void handleBlogLike(Integer blogId);
}