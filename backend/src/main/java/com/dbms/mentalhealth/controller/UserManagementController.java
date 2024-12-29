package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.user.request.ChangePasswordRequestDTO;
import com.dbms.mentalhealth.dto.user.request.UserUpdateRequestDTO;
import com.dbms.mentalhealth.dto.user.response.UserDataResponseDTO;
import com.dbms.mentalhealth.dto.user.response.UserDetailsSummaryResponseDTO;
import com.dbms.mentalhealth.dto.user.response.UserInfoResponseDTO;
import com.dbms.mentalhealth.exception.appointment.InvalidRequestException;
import com.dbms.mentalhealth.exception.user.UserNotFoundException;
import com.dbms.mentalhealth.exception.user.InvalidUserUpdateException;
import com.dbms.mentalhealth.mapper.UserMapper;
import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.repository.UserRepository;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.UserService;
import com.dbms.mentalhealth.service.impl.UserServiceImpl;
import com.dbms.mentalhealth.urlMapper.UserUrlMapping;
import com.dbms.mentalhealth.util.PdfGenerator;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserManagementController {

    private final JwtUtils jwtUtils;
    private final UserService userService;
    private final PdfGenerator pdfGenerator;
    private static final Logger logger = LoggerFactory.getLogger(UserManagementController.class);

    public UserManagementController(UserServiceImpl userService, JwtUtils jwtUtils, PdfGenerator pdfGenerator) {
        this.userService = userService;
        this.jwtUtils = jwtUtils;
        this.pdfGenerator = pdfGenerator;
    }

    @DeleteMapping(UserUrlMapping.DELETE_USER)
    @PreAuthorize("hasRole('ROLE_ADMIN')")
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
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<UserInfoResponseDTO> getUserById(@PathVariable Integer userId) {
        try {
            UserInfoResponseDTO userDTO = userService.getUserById(userId);
            return ResponseEntity.ok(userDTO);
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PutMapping(UserUrlMapping.UPDATE_USER)
    @PreAuthorize("isAuthenticated()")
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

    @PreAuthorize("isAuthenticated()")
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
    @PreAuthorize("hasRole('ROLE_ADMIN')")
    public ResponseEntity<String> suspendOrUnSuspendUser(@RequestParam String action, @PathVariable Integer userId) {
        try {
            userService.suspendOrUnSuspendUser(userId, action);
            return ResponseEntity.ok("User suspended successfully.");
        } catch (UserNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with ID: " + userId);
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(UserUrlMapping.GET_ALL_USERS_BY_PROFILE_STATUS)
    public ResponseEntity<Page<UserDetailsSummaryResponseDTO>> getAllUsers(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String search,
            Pageable pageable
    ) {
        logger.debug("Request to get users with search: {}", search);

        try {
            Page<User> users = userService.getUsersByFilters(status, search, pageable);
            Page<UserDetailsSummaryResponseDTO> response = users.map(UserMapper::toUserDetailsSummaryResponseDTO);

            logger.debug("Returning {} users of {} total",
                    response.getNumberOfElements(),
                    response.getTotalElements());

            return ResponseEntity.ok(response);
        } catch (InvalidRequestException e) {
            logger.error("Invalid request parameters", e);
            return ResponseEntity.badRequest().build();
        } catch (Exception e) {
            logger.error("Error fetching users", e);
            return ResponseEntity.internalServerError().build();
        }
    }


    @PreAuthorize("isAuthenticated()")
    @PostMapping(UserUrlMapping.REQUEST_VERIFICATION_CODE)
    public ResponseEntity<String> requestVerificationCode() {
        Integer userId = jwtUtils.getUserIdFromContext();
        UserInfoResponseDTO user = userService.getUserById(userId);
        userService.sendDataRequestVerificationEmail(user.getEmail());
        return ResponseEntity.ok("Verification code sent to your email.");
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping(UserUrlMapping.VERIFY_CODE_AND_GET_PDF)
    public ResponseEntity<byte[]> verifyCodeAndGetPdf(@RequestParam String verificationCode) {
        userService.verifyDataRequestCode(verificationCode);
        Integer userId = jwtUtils.getUserIdFromContext();
        UserDataResponseDTO userData = userService.getUserData(userId);
        byte[] pdfBytes = pdfGenerator.generateUserDataPdf(userData);

        HttpHeaders headers = new HttpHeaders();
        headers.set(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=user_data.pdf");
        headers.set(HttpHeaders.CONTENT_TYPE, "application/pdf");

        return new ResponseEntity<>(pdfBytes, headers, HttpStatus.OK);
    }
}