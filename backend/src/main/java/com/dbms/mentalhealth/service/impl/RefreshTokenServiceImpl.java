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
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
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
@Slf4j
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private static final long REFRESH_TOKEN_VALIDITY_MS = 1_000L * 60 * 60 * 24; // 24 hrs
    private final String baseUrl;
    private final UserService userService;
    private final RefreshTokenRepository refreshTokenRepository;
    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;

    @Autowired
    public RefreshTokenServiceImpl(
            RefreshTokenRepository refreshTokenRepository,
            UserRepository userRepository,
            JwtUtils jwtUtils,
            @Lazy UserService userService,
             @Value("${spring.app.base-url}") String baseUrl
    ) {
        this.refreshTokenRepository = refreshTokenRepository;
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
        this.userService = userService;
        this.baseUrl = baseUrl;
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
        log.debug("Attempting to get email from refresh token: {}", token.substring(0, 6) + "...");
        RefreshToken refreshToken = validateRefreshTokenAndGet(token);
        String email = refreshToken.getUser().getEmail();
        log.debug("Successfully retrieved email: {}", email);
        return email;
    }

    @Transactional
    @Override
    public void deleteRefreshToken(String token) {
        log.debug("Attempting to delete refresh token: {}", token.substring(0, 6) + "...");
        try {
            refreshTokenRepository.deleteByToken(token);
            log.info("Successfully deleted refresh token");
        } catch (Exception e) {
            log.error("Error deleting refresh token", e);
            throw e;
        }
    }
    @Override
    public boolean verifyRefreshToken(String token) {
        return refreshTokenRepository.findByToken(token)
                .filter(rt -> rt.getExpiry().isAfter(Instant.now()))
                .isPresent();
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
        log.debug("Validating refresh token: {}", token.substring(0, 6) + "...");
        return refreshTokenRepository.findByToken(token)
                .filter(rt -> {
                    boolean isValid = rt.getExpiry().isAfter(Instant.now());
                    log.debug("Token valid: {}, Expiry: {}", isValid, rt.getExpiry());
                    return isValid;
                })
                .orElseThrow(() -> {
                    log.warn("Invalid or expired refresh token");
                    return new RefreshTokenException("Invalid or expired refresh token");
                });
    }

    @Override
    public void setSecureRefreshTokenCookie(HttpServletResponse response, String refreshToken) {
        log.debug("Setting secure refresh token cookie");
        boolean isSecure = !baseUrl.contains("localhost");
        String domain = baseUrl.replaceAll("https?://", "")
                .replaceAll("/.*$", "")
                .trim();

        log.debug("Base URL: {}", baseUrl);
        log.debug("Calculated domain: {}", domain);
        log.debug("isSecure: {}", isSecure);

        if (domain.contains("localhost")) {
            domain = "localhost";
            log.debug("Domain set to localhost");
        }

        try {
            Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
            refreshTokenCookie.setHttpOnly(true);
            refreshTokenCookie.setSecure(isSecure);
            refreshTokenCookie.setPath("/mental-health/api/v1/users");
            refreshTokenCookie.setMaxAge(24 * 60 * 60);
            refreshTokenCookie.setDomain(domain);

            String cookieHeader = String.format(
                    "refreshToken=%s; " +
                            "HttpOnly; " +
                            "Secure=%s; " +
                            "Path=/mental-health/api/v1/users; " +
                            "Domain=%s; " +
                            "Max-Age=86400; " +
                            "SameSite=None",
                    refreshToken, isSecure, domain
            );

            log.debug("Cookie settings - HttpOnly: true, Secure: {}, Path: {}, Domain: {}, SameSite: None",
                    isSecure, "/mental-health/api/v1/users", domain);

            response.addCookie(refreshTokenCookie);
            response.addHeader("Set-Cookie", cookieHeader);
            log.info("Successfully set refresh token cookie and header");
        } catch (Exception e) {
            log.error("Error setting refresh token cookie", e);
            throw e;
        }
    }

}