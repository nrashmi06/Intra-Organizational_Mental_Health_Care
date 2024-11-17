package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.user.request.ResetPasswordRequestDTO;
import com.dbms.mentalhealth.dto.user.request.UserLoginRequestDTO;
import com.dbms.mentalhealth.dto.user.request.UserRegistrationRequestDTO;
import com.dbms.mentalhealth.dto.user.request.VerifyEmailRequestDTO;
import com.dbms.mentalhealth.dto.user.response.ResetPasswordResponseDTO;
import com.dbms.mentalhealth.dto.user.response.UserLoginResponseDTO;
import com.dbms.mentalhealth.dto.user.response.UserRegistrationResponseDTO;
import com.dbms.mentalhealth.dto.user.response.VerifyEmailResponseDTO;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.UserService;
import com.dbms.mentalhealth.urlMapper.userUrl.UserUrlMapping;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
public class AuthController {

    private final JwtUtils jwtUtils;
    private final UserService userService;

    public AuthController(UserService userService, JwtUtils jwtUtils) {
        this.userService = userService;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping(UserUrlMapping.USER_REGISTER)
    public ResponseEntity<UserRegistrationResponseDTO> registerUser(@RequestBody UserRegistrationRequestDTO userRegistrationDTO) {
        UserRegistrationResponseDTO userDTO = userService.registerUser(userRegistrationDTO);
        return ResponseEntity.ok(userDTO);
    }

    @PostMapping(UserUrlMapping.USER_LOGIN)
    public ResponseEntity<UserLoginResponseDTO> authenticateUser(@RequestBody UserLoginRequestDTO loginRequest) {
        UserLoginResponseDTO response = userService.loginUser(loginRequest);
        return ResponseEntity.ok(response);
    }

    @PostMapping(UserUrlMapping.USER_LOGOUT)
    public ResponseEntity<String> logoutUser(HttpServletRequest request, HttpServletResponse response) {
        String token = jwtUtils.getJwtFromHeader(request);
        if (token != null) {
            String email = jwtUtils.getUserNameFromJwtToken(token);
            jwtUtils.addToBlacklist(jwtUtils.getJtiFromToken(token));
            userService.setUserActiveStatus(email, false);
        }
        return ResponseEntity.ok("User logged out successfully.");
    }

    //function overloading in springboot hehe
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

    //forgot and reset password endpoints
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

}