package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.enums.BlogApprovalStatus;
import com.dbms.mentalhealth.model.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface BlogRepository extends JpaRepository<Blog, Integer> {

    @Query(value = """
            SELECT DISTINCT b FROM Blog b
            WHERE b.userId = :userId 
            AND (:status IS NULL OR b.blogApprovalStatus = :status)
            """)
    Page<Blog> findByUserIdAndOptionalStatus(
            @Param("userId") Integer userId,
            @Param("status") BlogApprovalStatus status,
            Pageable pageable
    );

    @Query(value = """
            SELECT DISTINCT b FROM Blog b
            WHERE LOWER(b.title) LIKE LOWER(CONCAT('%', :title, '%'))
            AND b.blogApprovalStatus = 'APPROVED'
            AND (:userId IS NULL OR b.userId = :userId)
            """)
    Page<Blog> findByTitleContainingIgnoreCase(
            @Param("title") String title,
            @Param("userId") Integer userId,
            Pageable pageable
    );

    @Query(value = """
            SELECT DISTINCT b FROM Blog b 
            WHERE b.blogApprovalStatus = :status
            AND (:userId IS NULL OR b.userId = :userId)
            """)
    Page<Blog> findByBlogApprovalStatus(
            @Param("status") BlogApprovalStatus status,
            @Param("userId") Integer userId,
            Pageable pageable
    );

    @Query(value = """
    SELECT DISTINCT b FROM Blog b
    WHERE b.blogApprovalStatus = 'APPROVED'
    AND (:userId IS NULL OR b.userId = :userId)
    """)
    Page<Blog> findRecentApprovedBlogs(
            @Param("userId") Integer userId,
            Pageable pageable
    );

    @Query(value = """
        SELECT DISTINCT b FROM Blog b
        WHERE b.blogApprovalStatus = 'APPROVED'
        AND (:userId IS NULL OR b.userId = :userId)
        """)
    Page<Blog> findMostViewedBlogs(
            @Param("userId") Integer userId,
            Pageable pageable
    );

    @Query(value = """
    SELECT DISTINCT b FROM Blog b
    WHERE b.blogApprovalStatus = 'APPROVED'
    AND (:userId IS NULL OR b.userId = :userId)
    """)
    Page<Blog> findMostLikedBlogs(
            @Param("userId") Integer userId,
            Pageable pageable
    );

    @Query(value = """
        WITH TrendingScores AS (
            SELECT 
                b.*,
                (b.view_count * 0.4 + b.like_count * 0.6) / 
                POWER(EXTRACT(EPOCH FROM (CURRENT_TIMESTAMP - COALESCE(b.publish_date, b.created_at)))/3600 + 1, 1.8) as trend_score
            FROM blogs b
            WHERE b.blog_approval_status = 'APPROVED'
            AND (:userId IS NULL OR b.user_id = :userId)
        )
        SELECT * FROM TrendingScores 
        ORDER BY trend_score DESC
        """,
            countQuery = """
            SELECT COUNT(*) FROM blogs b 
            WHERE b.blog_approval_status = 'APPROVED'
            AND (:userId IS NULL OR b.user_id = :userId)
            """,
            nativeQuery = true)
    Page<Blog> findTrendingBlogs(
            @Param("userId") Integer userId,
            Pageable pageable
    );
}