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
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class AuthController {

    private final JwtUtils jwtUtils;
    private final UserService userService;
    private final RefreshTokenServiceImpl refreshTokenService;
    private final String baseUrl;

    public AuthController(UserService userService, JwtUtils jwtUtils, RefreshTokenServiceImpl refreshTokenService, @Value("${spring.app.base-url}") String baseUrl) {
        this.userService = userService;
        this.jwtUtils = jwtUtils;
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
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> authenticateUser(@RequestBody UserLoginRequestDTO loginRequest, HttpServletResponse response) {
        try {
            Map<String, Object> loginResponse = userService.loginUser(loginRequest);

            String accessToken = (String) loginResponse.get("accessToken");
            String refreshToken = (String) loginResponse.get("refreshToken");
            UserLoginResponseDTO responseDTO = (UserLoginResponseDTO) loginResponse.get("user");

            boolean isSecure = !baseUrl.contains("localhost");

            Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
            refreshTokenCookie.setHttpOnly(true);
            refreshTokenCookie.setSecure(isSecure);
            refreshTokenCookie.setPath("/mental-health/api/v1/users");
            refreshTokenCookie.setMaxAge(24 * 60 * 60);
            refreshTokenCookie.setDomain("localhost");

            response.addHeader("Set-Cookie", "refreshToken=" + refreshToken + "; HttpOnly; Secure=" + isSecure + "; Path=/; Max-Age=86400; SameSite=None");
            response.addCookie(refreshTokenCookie);

            return ResponseEntity.ok()
                    .header("Authorization", "Bearer " + accessToken)
                    .body(responseDTO);
        } catch (InvalidUserCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PostMapping(UserUrlMapping.USER_LOGOUT)
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<String> logoutUser(@CookieValue("refreshToken") String refreshToken) {
        if (refreshToken != null) {
            String email = refreshTokenService.getEmailFromRefreshToken(refreshToken);
            userService.setUserActiveStatus(email, false);
            refreshTokenService.deleteRefreshToken(refreshToken);
        }
        return ResponseEntity.ok("User logged out successfully.");
    }

    @PostMapping(UserUrlMapping.VERIFY_EMAIL)
    @PreAuthorize("permitAll()")
    public ResponseEntity<VerifyEmailResponseDTO> sendVerificationEmail(@RequestBody VerifyEmailRequestDTO verifyEmailRequestDTO) {
        userService.sendVerificationEmail(verifyEmailRequestDTO.getEmail());
        return ResponseEntity.ok(new VerifyEmailResponseDTO("Verification email sent successfully."));
    }

    @GetMapping(UserUrlMapping.VERIFY_EMAIL)
    @PreAuthorize("permitAll()")
    public ResponseEntity<VerifyEmailResponseDTO> verifyEmail(@RequestParam String token) {
        userService.verifyUser(token);
        return ResponseEntity.ok(new VerifyEmailResponseDTO("Email verified successfully."));
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
    @PreAuthorize("permitAll()")
    public ResponseEntity<?> renewToken(@CookieValue("refreshToken") String refreshToken, HttpServletResponse response) {
        try {
            if (refreshToken == null) {
                throw new MissingRequestCookieException("Required cookie 'refreshToken' is not present");
            }

            Map<String, Object> renewResponse = refreshTokenService.renewToken(refreshToken);

            String newAccessToken = (String) renewResponse.get("accessToken");
            UserLoginResponseDTO responseDTO = (UserLoginResponseDTO) renewResponse.get("user");

            Cookie refreshTokenCookie = new Cookie("refreshToken", renewResponse.get("refreshToken").toString());
            boolean isSecure = !baseUrl.contains("localhost");
            refreshTokenCookie.setHttpOnly(true);
            refreshTokenCookie.setSecure(isSecure);
            refreshTokenCookie.setPath("/mental-health/api/v1/users");
            refreshTokenCookie.setMaxAge(24 * 60 * 60);

            response.addHeader("Set-Cookie", "refreshToken=" + renewResponse.get("refreshToken").toString()
                    + "; HttpOnly; Secure=" + isSecure + "; Path=/; Max-Age=86400; SameSite=None");
            response.addCookie(refreshTokenCookie);

            return ResponseEntity.ok()
                    .header("Authorization", "Bearer " + newAccessToken)
                    .body(responseDTO);
        } catch (RefreshTokenException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(e.getMessage());
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("An unexpected error occurred");
        }
    }
}