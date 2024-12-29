package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.dto.user.request.UserLoginRequestDTO;
import com.dbms.mentalhealth.dto.user.request.UserRegistrationRequestDTO;
import com.dbms.mentalhealth.dto.user.request.UserUpdateRequestDTO;
import com.dbms.mentalhealth.dto.user.response.UserDataResponseDTO;
import com.dbms.mentalhealth.dto.user.response.UserRegistrationResponseDTO;
import com.dbms.mentalhealth.dto.user.response.UserInfoResponseDTO;
import com.dbms.mentalhealth.model.User;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.userdetails.UserDetails;
import java.util.Map;

public interface UserService {
    Map<String, Object> loginUser(UserLoginRequestDTO userLoginDTO);
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
    boolean isAdmin(Integer userId);
    UserDetails loadUserByUsername(String email);
    void updateUserActivity(String email);
    void suspendOrUnSuspendUser(Integer userId, String action);
    UserDataResponseDTO getUserData(Integer userId);
    void sendDataRequestVerificationEmail(String email);
    void verifyDataRequestCode(String verificationCode);
    Page<User> getUsersByFilters(String status, String searchTerm, Pageable pageable);
}