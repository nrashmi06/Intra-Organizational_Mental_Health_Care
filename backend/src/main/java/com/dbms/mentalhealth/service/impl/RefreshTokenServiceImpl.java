package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.user.response.UserLoginResponseDTO;
import com.dbms.mentalhealth.exception.UserNotFoundException;
import com.dbms.mentalhealth.exception.RefreshTokenException;
import com.dbms.mentalhealth.mapper.UserMapper;
import com.dbms.mentalhealth.model.RefreshToken;
import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.repository.RefreshTokenRepository;
import com.dbms.mentalhealth.repository.UserRepository;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.RefreshTokenService;
import com.dbms.mentalhealth.service.UserService;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.UUID;

@Service
public class RefreshTokenServiceImpl implements RefreshTokenService {

    private static final long REFRESH_TOKEN_VALIDITY_MS = 1_000L * 60 * 60 * 24; //24 hrs

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

    /**
     * Create or update a refresh token for the given user email.
     */
    @Transactional
    @Override
    public RefreshToken createRefreshToken(String email) {
        // Find the user by email
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserNotFoundException("User not found with email: " + email);
        }

        // Check if a refresh token already exists for the user
        RefreshToken refreshToken = refreshTokenRepository.findRefreshTokenByUserId(user.getUserId())
                .orElseGet(() -> createNewRefreshToken(user));

        // Update expiry for existing refresh token
        refreshToken.setExpiry(Instant.now().plusMillis(REFRESH_TOKEN_VALIDITY_MS));
        refreshToken.setToken(UUID.randomUUID().toString()); // Regenerate token
        return refreshTokenRepository.save(refreshToken);
    }

    /**
     * Get the email associated with a valid refresh token.
     */
    @Override
    public String getEmailFromRefreshToken(String token) {
        RefreshToken refreshToken = validateRefreshTokenAndGet(token);
        return refreshToken.getUser().getEmail();
    }

    /**
     * Verify if the given refresh token is valid (exists and not expired).
     */
    @Override
    public boolean verifyRefreshToken(String token) {
        return refreshTokenRepository.findByToken(token)
                .filter(rt -> rt.getExpiry().isAfter(Instant.now()))
                .isPresent();
    }

    /**
     * Delete a refresh token by token string.
     */
    @Transactional
    @Override
    public void deleteRefreshToken(String token) {
        refreshTokenRepository.deleteByToken(token);
    }

    /**
     * Renew both access and refresh tokens using the provided refresh token.
     */
    @Transactional
    @Override
    public UserLoginResponseDTO renewToken(String refreshToken) {
        // Validate the provided refresh token and retrieve the associated user
        RefreshToken existingToken = validateRefreshTokenAndGet(refreshToken);

        // Load UserDetails using the email from the existing token
        UserDetails userDetails = userService.loadUserByUsername(existingToken.getUser().getEmail());

        // Generate new tokens using UserDetails
        String newAccessToken = jwtUtils.generateTokenFromUsername(userDetails);
        String newRefreshToken = createRefreshToken(userDetails.getUsername()).getToken();

        // Return response DTO with updated tokens
        User user = existingToken.getUser();  // No need to query again, already available
        return UserMapper.toUserLoginResponseDTO(user, newAccessToken, newRefreshToken);
    }


    /**
     * Helper method: Create a new refresh token for a user.
     */
    private RefreshToken createNewRefreshToken(User user) {
        return RefreshToken.builder()
                .token(UUID.randomUUID().toString())
                .expiry(Instant.now().plusMillis(REFRESH_TOKEN_VALIDITY_MS))
                .user(user)
                .build();
    }

    /**
     * Helper method: Validate a refresh token and retrieve it.
     */
    private RefreshToken validateRefreshTokenAndGet(String token) {
        return refreshTokenRepository.findByToken(token)
                .filter(rt -> rt.getExpiry().isAfter(Instant.now()))
                .orElseThrow(() -> new RefreshTokenException("Invalid or expired refresh token"));
    }
}
