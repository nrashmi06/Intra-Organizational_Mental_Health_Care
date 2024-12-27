package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.enums.BlogApprovalStatus;
import com.dbms.mentalhealth.enums.BlogFilterType;
import com.dbms.mentalhealth.model.Blog;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDateTime;

public interface BlogRepository extends JpaRepository<Blog, Integer> {

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

    // Repository method
    @Query("""
            SELECT DISTINCT b FROM Blog b
            WHERE b.blogApprovalStatus = 'APPROVED'
            AND (:userId IS NULL OR b.userId = :userId)
            AND (:title IS NULL OR b.title LIKE CONCAT('%', :title, '%'))
            """)
    Page<Blog> filterBlogs(
            @Param("userId") Integer userId,
            @Param("title") String title,
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