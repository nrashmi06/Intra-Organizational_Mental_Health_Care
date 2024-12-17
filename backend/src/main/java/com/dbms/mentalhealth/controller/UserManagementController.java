package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.user.request.ChangePasswordRequestDTO;
import com.dbms.mentalhealth.dto.user.request.UserUpdateRequestDTO;
import com.dbms.mentalhealth.dto.user.response.UserDataResponseDTO;
import com.dbms.mentalhealth.dto.user.response.UserDetailsSummaryResponseDTO;
import com.dbms.mentalhealth.dto.user.response.UserInfoResponseDTO;
import com.dbms.mentalhealth.exception.user.UserNotFoundException;
import com.dbms.mentalhealth.exception.user.InvalidUserUpdateException;
import com.dbms.mentalhealth.mapper.UserMapper;
import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.UserService;
import com.dbms.mentalhealth.service.impl.UserServiceImpl;
import com.dbms.mentalhealth.urlMapper.UserUrlMapping;
import com.dbms.mentalhealth.util.PdfGenerator;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class UserManagementController {

    private final JwtUtils jwtUtils;
    private final UserService userService;
    private final PdfGenerator pdfGenerator;

    public UserManagementController(UserServiceImpl userService, JwtUtils jwtUtils, PdfGenerator pdfGenerator) {
        this.userService = userService;
        this.jwtUtils = jwtUtils;
        this.pdfGenerator = pdfGenerator;
    }

    @DeleteMapping(UserUrlMapping.DELETE_USER)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable Integer userId) {
        try {
            userService.deleteUserById(userId);
            return ResponseEntity.ok("User deleted successfully.");
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found with ID: " + userId);
        }
    }

    @GetMapping(UserUrlMapping.GET_USER_BY_ID)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserInfoResponseDTO> getUserById(@PathVariable Integer userId) {
        try {
            UserInfoResponseDTO userDTO = userService.getUserById(userId);
            return ResponseEntity.ok(userDTO);
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping(UserUrlMapping.UPDATE_USER)
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<String> updateUser(
            @PathVariable Integer userId,
            @RequestBody UserUpdateRequestDTO userUpdateDTO,
            Authentication authentication) {
        try {
            userService.updateUserBasedOnRole(userId, userUpdateDTO, authentication);
            return ResponseEntity.ok("User updated successfully.");
        } catch (InvalidUserUpdateException e) {
            return ResponseEntity.badRequest().body("Invalid update request: " + e.getMessage());
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Error updating user: " + e.getMessage());
        }
    }

    @PutMapping(UserUrlMapping.CHANGE_PASSWORD)
    public ResponseEntity<String> changePassword(@PathVariable Integer userId, @RequestBody ChangePasswordRequestDTO changePasswordRequestDTO) {
        try {
            userService.changePasswordById(userId, changePasswordRequestDTO.getOldPassword(), changePasswordRequestDTO.getNewPassword());
            return ResponseEntity.ok("Password changed successfully.");
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with ID: " + userId);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PutMapping(UserUrlMapping.SUSPEND_USER_OR_UN_SUSPEND_USER)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> suspendOrUnSuspendUser(@RequestParam String action, @PathVariable Integer userId) {
        try {
            userService.suspendOrUnSuspendUser(userId, action);
            return ResponseEntity.ok("User suspended successfully.");
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with ID: " + userId);
        }
    }

    @GetMapping(UserUrlMapping.GET_ALL_USERS_BY_PROFILE_STATUS)
    public List<UserDetailsSummaryResponseDTO> getAllUsersByProfileStatus(
            @RequestParam(value = "status", required = false) String status) {
        List<User> users;
        if (status == null) {
            users = userService.getAllUsers();
        } else {
            users = userService.getUsersByProfileStatus(status);
        }
        return users.stream()
                .map(UserMapper::toUserDetailsSummaryResponseDTO)
                .toList();
    }

    @GetMapping(UserUrlMapping.GET_USER_DATA)
    public ResponseEntity<byte[]> getUserDataPdf() {
        Integer userId = jwtUtils.getUserIdFromContext();
        UserDataResponseDTO userData = userService.getUserData(userId);
        byte[] pdfBytes = pdfGenerator.generateUserDataPdf(userData);

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=user_data.pdf");
        headers.set(HttpHeaders.CONTENT_TYPE, "application/pdf");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}