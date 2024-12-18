package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.user.response.UserLoginResponseDTO;
import com.dbms.mentalhealth.exception.user.UserNotFoundException;
import com.dbms.mentalhealth.exception.token.RefreshTokenException;
import com.dbms.mentalhealth.mapper.UserMapper;
import com.dbms.mentalhealth.model.RefreshToken;
import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.repository.RefreshTokenRepository;
import com.dbms.mentalhealth.repository.UserRepository;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.RefreshTokenService;
import com.dbms.mentalhealth.service.UserService;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private static final long REFRESH_TOKEN_VALIDITY_MS = 1_000L * 60 * 60 * 24; // 24 hrs

    private final UserService userService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;

    @Autowired
    public RefreshTokenServiceImpl(
            RefreshTokenRepository refreshTokenRepository,
            UserRepository userRepository,
            JwtUtils jwtUtils,
            @Lazy UserService userService
    ) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
        this.userService = userService;
    }

    @Transactional
    @Override
    public RefreshToken createRefreshToken(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserNotFoundException("User not found with email: " + email);
        }

        RefreshToken refreshToken = refreshTokenRepository.findRefreshTokenByUserId(user.getUserId())
                .orElseGet(() -> createNewRefreshToken(user));

        refreshToken.setExpiry(Instant.now().plusMillis(REFRESH_TOKEN_VALIDITY_MS));
        refreshToken.setToken(UUID.randomUUID().toString());
        return refreshTokenRepository.save(refreshToken);
    }

    @Override
    public String getEmailFromRefreshToken(String token) {
        RefreshToken refreshToken = validateRefreshTokenAndGet(token);
        return refreshToken.getUser().getEmail();
    }

    @Override
    public boolean verifyRefreshToken(String token) {
        return refreshTokenRepository.findByToken(token)
                .filter(rt -> rt.getExpiry().isAfter(Instant.now()))
                .isPresent();
    }

    @Transactional
    @Override
    public void deleteRefreshToken(String token) {
        refreshTokenRepository.deleteByToken(token);
    }

    @Transactional
    @Override
    public Map<String, Object> renewToken(String refreshToken) {
        RefreshToken existingToken = validateRefreshTokenAndGet(refreshToken);

        UserDetails userDetails = userService.loadUserByUsername(existingToken.getUser().getEmail());
        Integer userId = existingToken.getUser().getUserId();

        String newAccessToken = jwtUtils.generateTokenFromUsername(userDetails, userId);
        String newRefreshToken = createRefreshToken(userDetails.getUsername()).getToken();

        User user = existingToken.getUser();
        user.setLastSeen(LocalDateTime.now());
        userRepository.save(user);

        UserLoginResponseDTO responseDTO = UserMapper.toUserLoginResponseDTO(user);

        Map<String, Object> response = new HashMap<>();
        response.put("user", responseDTO);
        response.put("accessToken", newAccessToken);
        response.put("refreshToken", newRefreshToken);

        return response;
    }


    private RefreshToken createNewRefreshToken(User user) {
        return RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .expiry(Instant.now().plusMillis(REFRESH_TOKEN_VALIDITY_MS))
                .user(user)
                .build();
    }

    private RefreshToken validateRefreshTokenAndGet(String token) {
        return refreshTokenRepository.findByToken(token)
                .filter(rt -> rt.getExpiry().isAfter(Instant.now()))
                .orElseThrow(() -> new RefreshTokenException("Invalid or expired refresh token"));
    }
}