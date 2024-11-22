package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.user.request.ChangePasswordRequestDTO;
import com.dbms.mentalhealth.dto.user.request.UserUpdateRequestDTO;
import com.dbms.mentalhealth.dto.user.response.UserInfoResponseDTO;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.UserService;
import com.dbms.mentalhealth.service.impl.UserServiceImpl;
import com.dbms.mentalhealth.urlMapper.UserUrlMapping;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
public class UserManagementController {

    private final JwtUtils jwtUtils;
    private final UserService userService;

    public UserManagementController(UserServiceImpl userService, JwtUtils jwtUtils) {
        this.userService = userService;
        this.jwtUtils = jwtUtils;
    }

    @DeleteMapping(UserUrlMapping.DELETE_USER)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> deleteUser(@PathVariable Integer userId) {
        try {
            userService.deleteUserById(userId);
            return ResponseEntity.ok("User deleted successfully.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found with ID: " + userId);
        }
    }

    @GetMapping(UserUrlMapping.GET_USER_BY_ID)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserInfoResponseDTO> getUserById(@PathVariable Integer userId) {
        UserInfoResponseDTO userDTO = userService.getUserById(userId);
        if (userDTO.getError() != null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(userDTO);
        }
        return ResponseEntity.ok(userDTO);
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
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Invalid update request: " + e.getMessage());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.badRequest().body("Error updating user: " + e.getMessage());
        }
    }

    @PutMapping(UserUrlMapping.CHANGE_PASSWORD)
    public ResponseEntity<String> changePassword(@PathVariable Integer userId, @RequestBody ChangePasswordRequestDTO changePasswordRequestDTO) {
        try {
            userService.changePasswordById(userId, changePasswordRequestDTO.getOldPassword(), changePasswordRequestDTO.getNewPassword());
            return ResponseEntity.ok("Password changed successfully.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("User not found with ID: " + userId);
        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}