package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.enums.BlogApprovalStatus;
import com.dbms.mentalhealth.model.Blog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public  interface BlogRepository extends JpaRepository<Blog, Integer> {
    List<Blog> findByUserId(Integer userId);
    Optional<Blog> findById(Integer blogId);
    List<Blog> findAllByBlogApprovalStatus(BlogApprovalStatus blogApprovalStatus);
    List<Blog> findByUserIdAndBlogApprovalStatus(Integer userId, BlogApprovalStatus blogApprovalStatus);
    List<Blog> findByTitleContainingIgnoreCase(String title);


}
