package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.enums.ApprovalStatus;
import com.dbms.mentalhealth.model.Blog;
import com.dbms.mentalhealth.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

public  interface BlogRepository extends JpaRepository<Blog, Integer> {
    List<Blog> findByUserId(Integer userId);
    Optional<Blog> findById(Integer blogId);
    List<Blog> findByApprovalStatus(ApprovalStatus approvalStatus);
    List<Blog> findByTitleContaining(String title);
    @Modifying
    @Transactional
    @Query("UPDATE Blog b SET b.viewCount = b.viewCount + 1 WHERE b.postId = :blogId")
    void incrementViewCount(Integer blogId);

}
