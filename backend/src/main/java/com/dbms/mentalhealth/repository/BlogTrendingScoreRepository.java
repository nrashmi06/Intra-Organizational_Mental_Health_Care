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
    WHERE bts.blogId IN (
        SELECT b.id FROM Blog b
        WHERE b.blogApprovalStatus = 'APPROVED'
        AND (:userId IS NULL OR b.userId = :userId)
        AND (:title IS NULL OR LOWER(b.title) LIKE CONCAT('%', LOWER(:title), '%'))
    )
       ORDER BY bts.trendingScore DESC
    """)
    Page<BlogTrendingScore> findTrendingBlogs(
            @Param("userId") Integer userId,
            @Param("title") String title,
            Pageable pageable
    );
}