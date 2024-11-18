package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.enums.ApprovalStatus;
import com.dbms.mentalhealth.model.Blog;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public  interface BlogRepository extends JpaRepository<Blog, Integer> {
    List<Blog> findByUserId(Integer userId);
    Optional<Blog> findById(Integer blogId);
    List<Blog> findByTitleContaining(String title);
    List<Blog> findAllByApprovalStatus(ApprovalStatus approvalStatus);
    List<Blog> findByUserIdAndApprovalStatus(Integer userId, ApprovalStatus approvalStatus);
    List<Blog> findByTitleContainingIgnoreCase(String title);


}
