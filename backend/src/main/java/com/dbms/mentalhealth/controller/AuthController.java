package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.user.request.ResetPasswordRequestDTO;
import com.dbms.mentalhealth.dto.user.request.UserLoginRequestDTO;
import com.dbms.mentalhealth.dto.user.request.UserRegistrationRequestDTO;
import com.dbms.mentalhealth.dto.user.request.VerifyEmailRequestDTO;
import com.dbms.mentalhealth.dto.user.response.ResetPasswordResponseDTO;
import com.dbms.mentalhealth.dto.user.response.UserLoginResponseDTO;
import com.dbms.mentalhealth.dto.user.response.UserRegistrationResponseDTO;
import com.dbms.mentalhealth.dto.user.response.VerifyEmailResponseDTO;
import com.dbms.mentalhealth.exception.token.MissingRequestCookieException;
import com.dbms.mentalhealth.exception.token.RefreshTokenException;
import com.dbms.mentalhealth.exception.user.InvalidUserCredentialsException;
import com.dbms.mentalhealth.exception.user.UserNotFoundException;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.UserService;
import com.dbms.mentalhealth.service.impl.RefreshTokenServiceImpl;
import com.dbms.mentalhealth.urlMapper.UserUrlMapping;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@Slf4j
public class AuthController {
    private final String baseUrl;
    private final UserService userService;
    private final RefreshTokenServiceImpl refreshTokenService;

    public AuthController(UserService userService,
                          RefreshTokenServiceImpl refreshTokenService,
                          @Value("${spring.app.base-url}") String baseUrl
    ) {
        this.userService = userService;
        this.refreshTokenService = refreshTokenService;
        this.baseUrl = baseUrl;
    }

    @PostMapping(UserUrlMapping.USER_REGISTER)
    @PreAuthorize("permitAll()")
    public ResponseEntity<UserRegistrationResponseDTO> registerUser(@RequestBody UserRegistrationRequestDTO userRegistrationDTO) {
        UserRegistrationResponseDTO userDTO = userService.registerUser(userRegistrationDTO);
        return ResponseEntity.ok(userDTO);
    }

    @PostMapping(UserUrlMapping.USER_LOGIN)
    public ResponseEntity<?> authenticateUser(
            @RequestBody UserLoginRequestDTO loginRequest,
            HttpServletResponse response) {
        log.debug("Processing login request for email: {}", loginRequest.getEmail());

        try {
            // Execute login and get response
            Map<String, Object> loginResponse = userService.loginUser(loginRequest);

            // Extract data from login response
            String accessToken = (String) loginResponse.get("accessToken");
            String refreshToken = (String) loginResponse.get("refreshToken");
            UserLoginResponseDTO userDTO = (UserLoginResponseDTO) loginResponse.get("user");

            if (accessToken == null || refreshToken == null || userDTO == null) {
                log.error("Login response missing required fields");
                return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                        .body("Authentication failed due to internal error");
            }

            // Set refresh token as secure HttpOnly cookie
            refreshTokenService.setSecureRefreshTokenCookie(response, refreshToken);

            // Set access token in Authorization header
            String bearerToken = "Bearer " + accessToken;

            log.info("User successfully authenticated: {}", userDTO.getEmail());

            return ResponseEntity.ok()
                    .header(HttpHeaders.AUTHORIZATION, bearerToken)
                    .body(userDTO);

        } catch (InvalidUserCredentialsException e) {
            log.warn("Invalid credentials for user login attempt: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid email or password");
        } catch (UserNotFoundException e) {
            log.warn("User not found during login: {}", e.getMessage());
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found");
        } catch (Exception e) {
            log.error("Unexpected error during login", e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred");
        }
    }


    @PostMapping(UserUrlMapping.USER_LOGOUT)
    public ResponseEntity<String> logoutUser(
            @CookieValue(name = "refreshToken", required = false) String refreshToken,
            @RequestHeader(value = "Authorization", required = false) String authHeader,
            HttpServletResponse response) {

        log.info("Logout request received");

        try {
            // First delete the token from database if it exists
            if (refreshToken != null && !refreshToken.isEmpty()) {
                try {
                    String email = refreshTokenService.getEmailFromRefreshToken(refreshToken);
                    userService.setUserActiveStatus(email, false);
                    refreshTokenService.deleteRefreshToken(refreshToken);
                    log.info("Refresh token deleted for user: {}", email);
                } catch (RefreshTokenException e) {
                    log.warn("Invalid refresh token during logout: {}", e.getMessage());
                    // Continue with logout even if token is invalid
                }
            }

            // Clear security context
            SecurityContextHolder.clearContext();

            // Clear cookies
            clearCookies(response);

        } catch (Exception e) {
            log.error("Unexpected error during logout process", e);
        }

        return ResponseEntity.ok("User logged out successfully.");
    }

    private void clearCookies(HttpServletResponse response) {
        log.info("Clearing refresh token cookie");

        boolean isSecure = !baseUrl.contains("localhost");
        String sameSite = isSecure ? "None" : "Lax"; // Use Lax for localhost

        // Create cookie with security attributes and max-age=0
        Cookie refreshTokenCookie = new Cookie("refreshToken", null);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(isSecure);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(0); // Expire immediately

        // Set domain for non-localhost environments
        if (!baseUrl.contains("localhost")) {
            String domain = baseUrl.replaceAll("https?://", "")
                    .replaceAll("/.*$", "")
                    .split(":")[0]
                    .trim();
            refreshTokenCookie.setDomain(domain);
        }

        // Add cookie to response
        response.addCookie(refreshTokenCookie);

        // Set explicit cookie header for additional browser compatibility
        String cookieString = String.format(
                "refreshToken=; Path=/; HttpOnly; Max-Age=0; SameSite=%s%s",
                sameSite,
                isSecure ? "; Secure" : ""
        );

        if (!baseUrl.contains("localhost")) {
            cookieString += "; Domain=" + refreshTokenCookie.getDomain();
        }

        response.setHeader("Set-Cookie", cookieString);

        log.info("Cookie cleared - Path: /, MaxAge: 0, Secure: {}, SameSite: {}",
                isSecure, sameSite);
    }

    @PostMapping(UserUrlMapping.VERIFY_EMAIL)
    @PreAuthorize("permitAll()")
    public ResponseEntity<VerifyEmailResponseDTO> sendVerificationEmail(@RequestBody VerifyEmailRequestDTO verifyEmailRequestDTO) {
        userService.sendVerificationEmail(verifyEmailRequestDTO.getEmail());
        return ResponseEntity.ok(new VerifyEmailResponseDTO("Verification email sent successfully."));
    }

    @PostMapping(UserUrlMapping.RESEND_VERIFICATION_EMAIL)
    @PreAuthorize("permitAll()")
    public ResponseEntity<VerifyEmailResponseDTO> resendVerificationEmail(@RequestBody VerifyEmailRequestDTO verifyEmailRequestDTO) {
        userService.resendVerificationEmail(verifyEmailRequestDTO.getEmail());
        return ResponseEntity.ok(new VerifyEmailResponseDTO("Verification email sent successfully."));
    }

    @PostMapping(UserUrlMapping.FORGOT_PASSWORD)
    @PreAuthorize("permitAll()")
    public ResponseEntity<VerifyEmailResponseDTO> forgotPassword(@RequestBody VerifyEmailRequestDTO verifyEmailRequestDTO) {
        userService.forgotPassword(verifyEmailRequestDTO.getEmail());
        return ResponseEntity.ok(new VerifyEmailResponseDTO("Password reset email sent successfully."));
    }

    @PostMapping(UserUrlMapping.RESET_PASSWORD)
    @PreAuthorize("permitAll()")
    public ResponseEntity<ResetPasswordResponseDTO> resetPassword(@RequestBody ResetPasswordRequestDTO resetPasswordRequestDTO) {
        userService.resetPassword(resetPasswordRequestDTO.getToken(), resetPasswordRequestDTO.getNewPassword());
        return ResponseEntity.ok(new ResetPasswordResponseDTO("Password has been reset successfully."));
    }

    @PostMapping(UserUrlMapping.RENEW_TOKEN)
    public ResponseEntity<?> renewToken(@CookieValue("refreshToken") String refreshToken,
                                        HttpServletResponse response) {
        try {
            if (refreshToken == null) {
                throw new MissingRequestCookieException("Required cookie 'refreshToken' is not present");
            }

            Map<String, Object> renewResponse = refreshTokenService.renewToken(refreshToken);

            String newAccessToken = (String) renewResponse.get("accessToken");
            String newRefreshToken = (String) renewResponse.get("refreshToken");
            UserLoginResponseDTO responseDTO = (UserLoginResponseDTO) renewResponse.get("user");

            // Set new refresh token as HttpOnly cookie
            refreshTokenService.setSecureRefreshTokenCookie(response, newRefreshToken);

            // Only return new access token in Authorization header and user data in body
            return ResponseEntity.ok()
                    .header(HttpHeaders.AUTHORIZATION, "Bearer " + newAccessToken)
                    .body(responseDTO);
        } catch (RefreshTokenException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An unexpected error occurred");
        }
    }
}