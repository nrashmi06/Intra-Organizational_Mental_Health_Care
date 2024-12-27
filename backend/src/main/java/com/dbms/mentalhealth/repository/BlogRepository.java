package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.enums.BlogApprovalStatus;
import com.dbms.mentalhealth.model.Blog;
import com.dbms.mentalhealth.model.BlogTrendingScore;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

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


    @Query("""
    SELECT b FROM Blog b 
    WHERE b.createdAt >= :cutoff 
    OR b.updatedAt >= :cutoff 
    OR EXISTS (
        SELECT 1 FROM BlogLike bl 
        WHERE bl.blog = b AND bl.createdAt >= :cutoff
    )
""")
    Page<Blog> findRecentlyActiveBlogs(
            @Param("cutoff") LocalDateTime cutoff,
            Pageable pageable
    );


}