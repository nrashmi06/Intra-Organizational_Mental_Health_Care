package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.model.RefreshToken;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface RefreshTokenRepository extends JpaRepository<RefreshToken, Integer> {
    Optional<RefreshToken> findByToken(String token);
    void deleteByToken(String token);
    @Query("SELECT rt FROM RefreshToken rt WHERE rt.user.userId = :userId")
    Optional<RefreshToken> findRefreshTokenByUserId(@Param("userId") Integer userId);
    void deleteByUser_UserId(Integer userId);
}
