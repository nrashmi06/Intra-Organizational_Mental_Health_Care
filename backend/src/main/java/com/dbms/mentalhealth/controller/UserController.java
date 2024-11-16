package com.dbms.mentalhealth.controller;
import com.dbms.mentalhealth.dto.user.request.UserLoginRequestDTO;
import com.dbms.mentalhealth.dto.user.request.UserRegistrationRequestDTO;
import com.dbms.mentalhealth.dto.user.request.UserUpdateRequestDTO;
import com.dbms.mentalhealth.dto.user.response.UserLoginResponseDTO;
import com.dbms.mentalhealth.dto.user.response.UserRegistrationResponseDTO;
import com.dbms.mentalhealth.dto.user.response.UserInfoResponseDTO;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.UserService;
import com.dbms.mentalhealth.urlMapper.userUrl.UserUrlMapping;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.security.core.GrantedAuthority;


@RestController
public class UserController {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private AuthenticationManager authenticationManager;

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
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


    @DeleteMapping(UserUrlMapping.DELETE_USER)
    @PreAuthorize("hasRole('ADMIN')") // Restrict to ADMIN only
    public ResponseEntity<String> deleteUser(@PathVariable Integer userId) {
        try {
            userService.deleteUserById(userId); // Call service to delete user
            return ResponseEntity.ok("User deleted successfully.");
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND)
                    .body("User not found with ID: " + userId);
        }
    }

    @GetMapping(UserUrlMapping.GET_USER_BY_ID)
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<UserInfoResponseDTO> getUserById(@PathVariable Integer userId) {
        UserInfoResponseDTO userDTO = userService.getUserById(userId); // Call service to get user by ID

        if (userDTO.getError() != null) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(userDTO);
        }

        return ResponseEntity.ok(userDTO);
    }
    // Admin: Update role or suspend profile
    // User: Update anonymous name
    @PutMapping(UserUrlMapping.UPDATE_USER)
    @PreAuthorize("hasRole('ADMIN') or hasRole('USER')")
    public ResponseEntity<String> updateUser(@PathVariable Integer userId, @RequestBody UserUpdateRequestDTO userUpdateDTO, Authentication authentication) {
        try {
            // Get the role of the authenticated user
            String authenticatedUserRole = authentication.getAuthorities().stream()
                    .map(GrantedAuthority::getAuthority)
                    .findFirst()
                    .orElse("");

            if (authenticatedUserRole.equals("ROLE_ADMIN")) {
                // Admin update
                userService.updateUser(userId, userUpdateDTO);
                return ResponseEntity.ok("User updated successfully by admin.");
            } else if (authenticatedUserRole.equals("ROLE_USER") && userUpdateDTO.getAnonymousName() != null) {
                // User update
                userService.updateAnonymousName(userId, userUpdateDTO.getAnonymousName());
                return ResponseEntity.ok("Anonymous name updated successfully.");
            } else {
                return ResponseEntity.badRequest().body("Invalid update request.");
            }
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Error updating user: " + e.getMessage());
        }
    }


}