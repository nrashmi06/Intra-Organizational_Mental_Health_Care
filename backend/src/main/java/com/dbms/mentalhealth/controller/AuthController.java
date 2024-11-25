package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.user.request.ResetPasswordRequestDTO;
import com.dbms.mentalhealth.dto.user.request.UserLoginRequestDTO;
import com.dbms.mentalhealth.dto.user.request.UserRegistrationRequestDTO;
import com.dbms.mentalhealth.dto.user.request.VerifyEmailRequestDTO;
import com.dbms.mentalhealth.dto.user.response.ResetPasswordResponseDTO;
import com.dbms.mentalhealth.dto.user.response.UserLoginResponseDTO;
import com.dbms.mentalhealth.dto.user.response.UserRegistrationResponseDTO;
import com.dbms.mentalhealth.dto.user.response.VerifyEmailResponseDTO;
import com.dbms.mentalhealth.exception.UserNotFoundException;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.UserService;
import com.dbms.mentalhealth.service.impl.RefreshTokenServiceImpl;
import com.dbms.mentalhealth.urlMapper.UserUrlMapping;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
public class AuthController {

    private final JwtUtils jwtUtils;
    private final UserService userService;
    private final AuthenticationManager authenticationManager;
    private final RefreshTokenServiceImpl refreshTokenService;

    public AuthController(UserService userService, JwtUtils jwtUtils, AuthenticationManager authenticationManager, RefreshTokenServiceImpl refreshTokenService) {
        this.userService = userService;
        this.jwtUtils = jwtUtils;
        this.authenticationManager = authenticationManager;
        this.refreshTokenService = refreshTokenService;
    }

    @PostMapping(UserUrlMapping.USER_REGISTER)
    public ResponseEntity<UserRegistrationResponseDTO> registerUser(@RequestBody UserRegistrationRequestDTO userRegistrationDTO) {
        UserRegistrationResponseDTO userDTO = userService.registerUser(userRegistrationDTO);
        return ResponseEntity.ok(userDTO);
    }

    @PostMapping(UserUrlMapping.USER_LOGIN)
    public ResponseEntity<UserLoginResponseDTO> authenticateUser(@RequestBody UserLoginRequestDTO loginRequest, HttpServletResponse response) {
        Map<String, Object> loginResponse = userService.loginUser(loginRequest);

        String accessToken = (String) loginResponse.get("accessToken");
        String refreshToken = (String) loginResponse.get("refreshToken");
        UserLoginResponseDTO responseDTO = (UserLoginResponseDTO) loginResponse.get("user");

        Cookie refreshTokenCookie = new Cookie("refreshToken", refreshToken);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(false);
        refreshTokenCookie.setPath("/mental-health/api/v1/users"); // Use the constant from UserUrlMapping
        refreshTokenCookie.setMaxAge(24 * 60 * 60); // 1 day

        response.addCookie(refreshTokenCookie);

        return ResponseEntity.ok()
                .header("Authorization", "Bearer " + accessToken)
                .body(responseDTO);
    }

    @PostMapping(UserUrlMapping.USER_LOGOUT)
    public ResponseEntity<String> logoutUser(@CookieValue("refreshToken") String refreshToken) {
        if (refreshToken != null) {
            String email = refreshTokenService.getEmailFromRefreshToken(refreshToken);
            userService.setUserActiveStatus(email, false); // Set isActive to false
            refreshTokenService.deleteRefreshToken(refreshToken);
        }
        return ResponseEntity.ok("User logged out successfully.");
    }

    @PostMapping(UserUrlMapping.VERIFY_EMAIL)
    public ResponseEntity<VerifyEmailResponseDTO> sendVerificationEmail(@RequestBody VerifyEmailRequestDTO verifyEmailRequestDTO) {
        userService.sendVerificationEmail(verifyEmailRequestDTO.getEmail());
        return ResponseEntity.ok(new VerifyEmailResponseDTO("Verification email sent successfully."));
    }

    @GetMapping(UserUrlMapping.VERIFY_EMAIL)
    public ResponseEntity<VerifyEmailResponseDTO> verifyEmail(@RequestParam String token) {
        userService.verifyUser(token);
        return ResponseEntity.ok(new VerifyEmailResponseDTO("Email verified successfully."));
    }

    @PostMapping(UserUrlMapping.RESEND_VERIFICATION_EMAIL)
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
    public ResponseEntity<ResetPasswordResponseDTO> resetPassword(@RequestBody ResetPasswordRequestDTO resetPasswordRequestDTO) {
        userService.resetPassword(resetPasswordRequestDTO.getToken(), resetPasswordRequestDTO.getNewPassword());
        return ResponseEntity.ok(new ResetPasswordResponseDTO("Password has been reset successfully."));
    }

    @PreAuthorize("permitAll()")
    @PostMapping(UserUrlMapping.RENEW_TOKEN)
    public ResponseEntity<UserLoginResponseDTO> renewToken(@CookieValue("refreshToken") String refreshToken, HttpServletResponse response) {
        try {
            Map<String, Object> renewResponse = refreshTokenService.renewToken(refreshToken);

            String newAccessToken = (String) renewResponse.get("accessToken");
            String newRefreshToken = (String) renewResponse.get("refreshToken");
            UserLoginResponseDTO responseDTO = (UserLoginResponseDTO) renewResponse.get("user");

            Cookie newRefreshTokenCookie = new Cookie("refreshToken", newRefreshToken);
            newRefreshTokenCookie.setHttpOnly(true);
            newRefreshTokenCookie.setPath("/mental-health/api/v1/users");
            newRefreshTokenCookie.setMaxAge((60 * 60 * 24 * 1000)); //same as refresh token valididyt

            response.addCookie(newRefreshTokenCookie);

            return ResponseEntity.ok()
                    .header("Authorization", "Bearer " + newAccessToken)
                    .body(responseDTO);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.status(401).body(null);
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(404).body(null);
        }
    }
}