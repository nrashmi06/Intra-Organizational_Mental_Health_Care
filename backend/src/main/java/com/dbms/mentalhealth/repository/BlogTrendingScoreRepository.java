package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.model.BlogTrendingScore;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface BlogTrendingScoreRepository extends JpaRepository<BlogTrendingScore, Integer> {
    @Query("""
            SELECT bts FROM BlogTrendingScore bts
            JOIN Blog b ON b.id = bts.blogId
            WHERE b.blogApprovalStatus = 'APPROVED'
            AND (:userId IS NULL OR b.userId = :userId)
            ORDER BY bts.trendingScore DESC, bts.lastCalculated DESC
            """)
    Page<BlogTrendingScore> findTrendingBlogs(
            @Param("userId") Integer userId,
            Pageable pageable
    );
}