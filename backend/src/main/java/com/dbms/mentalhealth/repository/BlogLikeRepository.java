package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.model.BlogLike;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface BlogLikeRepository extends JpaRepository<BlogLike, Integer> {
}