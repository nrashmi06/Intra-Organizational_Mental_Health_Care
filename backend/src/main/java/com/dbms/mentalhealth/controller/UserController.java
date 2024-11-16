package com.dbms.mentalhealth.controller;
import com.dbms.mentalhealth.dto.user.request.UserLoginRequestDTO;
import com.dbms.mentalhealth.dto.user.request.UserRegistrationRequestDTO;
import com.dbms.mentalhealth.dto.user.response.UserLoginResponseDTO;
import com.dbms.mentalhealth.dto.user.response.UserRegistrationResponseDTO;
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
import org.springframework.web.bind.annotation.*;


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


}