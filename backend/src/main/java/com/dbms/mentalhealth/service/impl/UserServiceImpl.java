package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.user.request.UserLoginRequestDTO;
import com.dbms.mentalhealth.dto.user.request.UserRegistrationRequestDTO;
import com.dbms.mentalhealth.dto.user.request.UserUpdateRequestDTO;
import com.dbms.mentalhealth.dto.user.response.UserLoginResponseDTO;
import com.dbms.mentalhealth.dto.user.response.UserRegistrationResponseDTO;
import com.dbms.mentalhealth.dto.user.response.UserInfoResponseDTO;
import com.dbms.mentalhealth.enums.ProfileStatus;
import com.dbms.mentalhealth.enums.Role;
import com.dbms.mentalhealth.exception.InvalidUserCredentialsException;
import com.dbms.mentalhealth.exception.UserNotActiveException;
import com.dbms.mentalhealth.mapper.UserMapper;
import com.dbms.mentalhealth.model.EmailVerification;
import com.dbms.mentalhealth.repository.EmailVerificationRepository;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.repository.UserRepository;
import com.dbms.mentalhealth.service.EmailService;
import com.dbms.mentalhealth.service.RefreshTokenService;
import com.dbms.mentalhealth.service.UserActivityService;
import com.dbms.mentalhealth.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.context.annotation.Lazy;
import org.springframework.http.HttpStatus;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.*;

@Service
public class UserServiceImpl implements UserService, UserDetailsService {

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationRepository emailVerificationRepository;
    private final EmailService emailService;
    private final RefreshTokenService refreshTokenService;
    private final UserActivityService userActivityService;

    public UserServiceImpl(UserRepository userRepository, UserActivityService userActivityService, RefreshTokenService refreshTokenService, JwtUtils jwtUtils, @Lazy AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder, EmailVerificationRepository emailVerificationRepository, EmailService emailService) {
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.emailVerificationRepository = emailVerificationRepository;
        this.emailService = emailService;
        this.refreshTokenService = refreshTokenService;
        this.userActivityService = userActivityService;
    }

    @Override
    public UserDetails loadUserByUsername(String email) throws UsernameNotFoundException {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + email);
        }
        return new org.springframework.security.core.userdetails.User(
                user.getEmail(),
                user.getPassword(),
                createAuthorities(user.getRole())
        );
    }

    public boolean isAdmin(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        return user.getRole().equals(Role.ADMIN);
    }

    private static List<GrantedAuthority> createAuthorities(Role role) {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    public Map<String, Object> loginUser(UserLoginRequestDTO userLoginDTO) {
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(userLoginDTO.getEmail(), userLoginDTO.getPassword())
            );
        } catch (Exception e) {
            throw new InvalidUserCredentialsException("Invalid email or password");
        }

        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername());

        if (user == null) {
            throw new UsernameNotFoundException("User not found with email: " + userDetails.getUsername());
        }

        if (!user.getProfileStatus().equals(ProfileStatus.ACTIVE)) {
            throw new UserNotActiveException("User is not active");
        }

        setUserActiveStatus(user.getEmail(), true);

        String accessToken = jwtUtils.generateTokenFromUsername(userDetails, user.getUserId());
        String refreshToken = refreshTokenService.createRefreshToken(user.getEmail()).getToken();
        UserLoginResponseDTO responseDTO = UserMapper.toUserLoginResponseDTO(user);

        Map<String, Object> response = new HashMap<>();
        response.put("user", responseDTO);
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken);

        return response;
    }

    @Transactional
    public UserRegistrationResponseDTO registerUser(UserRegistrationRequestDTO userRegistrationDTO) {
        if (userRepository.existsByEmail(userRegistrationDTO.getEmail())) {
            throw new IllegalArgumentException("Email is already in use: " + userRegistrationDTO.getEmail());
        }

        if (!isValidUsername(userRegistrationDTO.getAnonymousName())) {
            throw new IllegalArgumentException("Invalid username: " + userRegistrationDTO.getAnonymousName() + ". Please try another.");
        }

        User user = UserMapper.toEntity(userRegistrationDTO, passwordEncoder.encode(userRegistrationDTO.getPassword()));
        userRepository.save(user);
        return UserMapper.toRegistrationResponseDTO(user);
    }

    private boolean isValidUsername(String username) {
        // Add your username validation logic here
        return username.matches("^[a-zA-Z0-9._-]{3,}$");
    }



    public void deleteUserById(Integer userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            throw new EntityNotFoundException("User not found with ID: " + userId);
        }

        if (user.get().getRole() == Role.ADMIN) {
            throw new IllegalArgumentException("Cannot delete user with ADMIN role");
        }

        userRepository.deleteById(userId);
    }

    public UserInfoResponseDTO getUserById(Integer userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {
            return new UserInfoResponseDTO("User not found with ID: " + userId);
        }

        return UserMapper.toInfoResponseDTO(user.get());
    }

    public void updateUserBasedOnRole(Integer userId, UserUpdateRequestDTO userUpdateDTO, Authentication authentication) {
        // Fetch authenticated user's role
        String authenticatedUserRole = authentication.getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElseThrow(() -> new IllegalArgumentException("Unable to determine authenticated user role."));

        if (authenticatedUserRole.equals("ROLE_ADMIN")) {
            // Admin update
            updateUserAsAdmin(userId, userUpdateDTO);
        } else if (authenticatedUserRole.equals("ROLE_USER") && userUpdateDTO.getAnonymousName() != null) {
            // User update
            updateAnonymousName(userId, userUpdateDTO.getAnonymousName());
        } else {
            throw new IllegalArgumentException("Invalid update request.");
        }
    }

    private void updateUserAsAdmin(Integer userId, UserUpdateRequestDTO userUpdateDTO) {
        User userToUpdate = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        // Validate and update role
        if (userUpdateDTO.getRole() != null) {
            if (userToUpdate.getRole().equals(Role.ADMIN)) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot update role of user with ADMIN role");
            }
            if (userUpdateDTO.getRole().equals("ADMIN")) {
                throw new ResponseStatusException(HttpStatus.FORBIDDEN, "Cannot update role to ADMIN");
            }
            userToUpdate.setRole(Role.valueOf(userUpdateDTO.getRole()));
        }
        userToUpdate.setAnonymousName(userUpdateDTO.getAnonymousName());

        // Update profile status
        if (userUpdateDTO.getProfileStatus() != null) {
            userToUpdate.setProfileStatus(ProfileStatus.valueOf(userUpdateDTO.getProfileStatus()));
        }

        userRepository.save(userToUpdate);
    }

    private void updateAnonymousName(Integer userId, String anonymousName) {
        User userToUpdate = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        userToUpdate.setAnonymousName(anonymousName);
        userRepository.save(userToUpdate);
    }

    public void changePasswordById(Integer userId, String oldPassword, String newPassword) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        if (!passwordEncoder.matches(oldPassword, user.getPassword())) {
            throw new IllegalArgumentException("Old password is incorrect");
        }

        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);
    }

    public void sendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("User not found with email: " + email);
        }
        // Check if user is already verified
        if (user.getProfileStatus().equals(ProfileStatus.ACTIVE)) {
            throw new IllegalArgumentException("User is already verified");
        }
        String token = UUID.randomUUID().toString().substring(0, 10);
        EmailVerification emailVerification = new EmailVerification();
        emailVerification.setUserId(user.getUserId());
        emailVerification.setVerificationCode(token);
        emailVerification.setEmail(email);
        emailVerification.setExpiryTime(LocalDateTime.now().plusHours(24));
        emailVerification.setStatus("pending");
        emailVerification.setCreatedAt(LocalDateTime.now());
        emailVerificationRepository.save(emailVerification);

        emailService.sendVerificationEmail(user.getEmail(), token);
    }

    public void verifyUser(String verificationCode) {
        EmailVerification emailVerification = emailVerificationRepository.findByVerificationCode(verificationCode)
                .orElseThrow(() -> new IllegalArgumentException("Invalid verification code"));

        if (emailVerification.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Verification code has expired");
        }

        emailVerification.setStatus("verified");
        emailVerificationRepository.save(emailVerification);

        User user = userRepository.findById(emailVerification.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setProfileStatus(ProfileStatus.ACTIVE);
        userRepository.save(user);
    }

    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("User not found with email: " + email);
        }
        if (user.getProfileStatus().equals(ProfileStatus.ACTIVE)) {
            throw new IllegalArgumentException("User is already verified");
        }
        EmailVerification emailVerification = emailVerificationRepository.findByEmail(email)
                .orElseThrow(() -> new IllegalArgumentException("No verification code found for user"));

        if (emailVerification.getExpiryTime().isBefore(LocalDateTime.now())) {
            emailVerification.setVerificationCode(UUID.randomUUID().toString().substring(0, 10));
            emailVerification.setExpiryTime(LocalDateTime.now().plusHours(24));
            emailVerification.setStatus("pending");
            emailVerification.setCreatedAt(LocalDateTime.now());
            emailVerificationRepository.save(emailVerification);
        }

        emailService.sendVerificationEmail(user.getEmail(), emailVerification.getVerificationCode());
    }

    public void forgotPassword(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new IllegalArgumentException("User not found with email: " + email);
        }
        String token = UUID.randomUUID().toString().replaceAll("[^0-9]", "").substring(0, 6);
        EmailVerification emailVerification = new EmailVerification();
        emailVerification.setUserId(user.getUserId());
        emailVerification.setVerificationCode(token);
        emailVerification.setEmail(email);
        emailVerification.setStatus("pending");
        emailVerification.setExpiryTime(LocalDateTime.now().plusMinutes(5)); // Set less time for forgot password
        emailVerification.setCreatedAt(LocalDateTime.now());
        emailVerificationRepository.save(emailVerification);

        emailService.sendPasswordResetEmail(user.getEmail(), token);
    }

    public void resetPassword(String token, String newPassword) {
        EmailVerification emailVerification = emailVerificationRepository.findByVerificationCode(token)
                .orElseThrow(() -> new IllegalArgumentException("Invalid verification code"));

        if (emailVerification.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException("Verification code has expired");
        }

        User user = userRepository.findById(emailVerification.getUserId())
                .orElseThrow(() -> new IllegalArgumentException("User not found"));
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        emailVerification.setStatus("verified");
        emailVerificationRepository.save(emailVerification);
    }

    public Integer getUserIdByUsername(String username) {
        User user = userRepository.findByEmail(username);
        return user != null ? user.getUserId() : null;
    }

    public String getUserNameFromAuthentication(Authentication authentication) {
        return authentication.getName();
    }

    public User findByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    @Override
    @Transactional
    public void updateUserActivity(String email) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            user.setLastSeen(LocalDateTime.now());
            userRepository.save(user);
            userActivityService.updateLastSeen(email);
        }
    }

    @Override
    public void setUserActiveStatus(String email, boolean isActive) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            if (isActive) {
                user.setLastSeen(LocalDateTime.now());
                userRepository.save(user);
                userActivityService.updateLastSeen(email);
            }else{
                userRepository.save(user);
                userActivityService.markUserInactive(email);
            }
        }
    }
}