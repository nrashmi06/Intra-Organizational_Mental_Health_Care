package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.dto.user.request.UserLoginRequestDTO;
import com.dbms.mentalhealth.dto.user.request.UserRegistrationRequestDTO;
import com.dbms.mentalhealth.dto.user.request.UserUpdateRequestDTO;
import com.dbms.mentalhealth.dto.user.response.UserLoginResponseDTO;
import com.dbms.mentalhealth.dto.user.response.UserRegistrationResponseDTO;
import com.dbms.mentalhealth.dto.user.response.UserInfoResponseDTO;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;

public interface UserService {
    UserLoginResponseDTO loginUser(UserLoginRequestDTO userLoginDTO);
    UserRegistrationResponseDTO registerUser(UserRegistrationRequestDTO userRegistrationDTO);
    void setUserActiveStatus(String email, boolean isActive);
    void deleteUserById(Integer userId);
    UserInfoResponseDTO getUserById(Integer userId);
    void updateUserBasedOnRole(Integer userId, UserUpdateRequestDTO userUpdateDTO, Authentication authentication);
    void changePasswordById(Integer userId, String oldPassword, String newPassword);
    void sendVerificationEmail(String email);
    void verifyUser(String verificationCode);
    void resendVerificationEmail(String email);
    void forgotPassword(String email);
    void resetPassword(String token, String newPassword);
    Integer getUserIdByUsername(String username);
    boolean isAdmin(Integer userId);
    UserDetails loadUserByUsername(String email);
    String getUserNameFromAuthentication(Authentication authentication);
}