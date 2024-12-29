package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.user.request.UserLoginRequestDTO;
import com.dbms.mentalhealth.dto.user.request.UserRegistrationRequestDTO;
import com.dbms.mentalhealth.dto.user.request.UserUpdateRequestDTO;
import com.dbms.mentalhealth.dto.user.response.UserDataResponseDTO;
import com.dbms.mentalhealth.dto.user.response.UserLoginResponseDTO;
import com.dbms.mentalhealth.dto.user.response.UserRegistrationResponseDTO;
import com.dbms.mentalhealth.dto.user.response.UserInfoResponseDTO;
import com.dbms.mentalhealth.enums.ProfileStatus;
import com.dbms.mentalhealth.enums.Role;
import com.dbms.mentalhealth.exception.appointment.InvalidRequestException;
import com.dbms.mentalhealth.exception.user.*;
import com.dbms.mentalhealth.mapper.UserMapper;
import com.dbms.mentalhealth.model.Appointment;
import com.dbms.mentalhealth.model.EmailVerification;
import com.dbms.mentalhealth.model.Session;
import com.dbms.mentalhealth.repository.AppointmentRepository;
import com.dbms.mentalhealth.repository.EmailVerificationRepository;
import com.dbms.mentalhealth.repository.SessionRepository;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.repository.UserRepository;
import com.dbms.mentalhealth.service.EmailService;
import com.dbms.mentalhealth.service.RefreshTokenService;
import com.dbms.mentalhealth.service.UserActivityService;
import com.dbms.mentalhealth.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.annotation.Profile;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.transaction.annotation.Transactional;
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
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService, UserDetailsService {
    private static final Logger logger = LoggerFactory.getLogger(UserService.class);

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;
    private final EmailVerificationRepository emailVerificationRepository;
    private final EmailService emailService;
    private final RefreshTokenService refreshTokenService;
    private final UserActivityService userActivityService;
    private final SessionRepository sessionRepository;
    private final AppointmentRepository appointmentRepository;

    public UserServiceImpl(UserRepository userRepository, UserActivityService userActivityService, RefreshTokenService refreshTokenService, JwtUtils jwtUtils, @Lazy AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder, EmailVerificationRepository emailVerificationRepository, EmailService emailService, SessionRepository sessionRepository, AppointmentRepository appointmentRepository) {
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.emailVerificationRepository = emailVerificationRepository;
        this.emailService = emailService;
        this.refreshTokenService = refreshTokenService;
        this.userActivityService = userActivityService;
        this.sessionRepository = sessionRepository;
        this.appointmentRepository = appointmentRepository;
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
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
        return user.getRole().equals(Role.ADMIN);
    }

    private static List<GrantedAuthority> createAuthorities(Role role) {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    @Override
    @Transactional
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
        if(user.getProfileStatus().equals(ProfileStatus.SUSPENDED)){
            throw new UserAccountSuspendedException("User Account Suspended");
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
            throw new EmailAlreadyInUseException("Email is already in use: " + userRegistrationDTO.getEmail());
        }

        if (!isValidUsername(userRegistrationDTO.getAnonymousName())) {
            throw new InvalidUsernameException("Invalid username: " + userRegistrationDTO.getAnonymousName() + ". Please try another.");
        }

        if (userRepository.existsByAnonymousName(userRegistrationDTO.getAnonymousName())) {
            throw new AnonymousNameAlreadyInUseException("Anonymous name is already in use: " + userRegistrationDTO.getAnonymousName());
        }

        try {
            User user = UserMapper.toEntity(userRegistrationDTO, passwordEncoder.encode(userRegistrationDTO.getPassword()));
            userRepository.save(user);
            return UserMapper.toRegistrationResponseDTO(user);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while registering the user", e);
        }
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
            throw new UserNotFoundException("User not found with email: " + email);
        }
        // Check if user is already verified
        if (user.getProfileStatus().equals(ProfileStatus.ACTIVE)) {
            throw new EmailAlreadyVerifiedException("User is already verified");
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
        if(user.getProfileStatus().equals(ProfileStatus.SUSPENDED)){
            throw new UserAccountSuspendedException("User Account Suspended");
        }
        user.setProfileStatus(ProfileStatus.ACTIVE);
        userRepository.save(user);
    }

    public void resendVerificationEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserNotFoundException("User not found with email: " + email);
        }
        if (user.getProfileStatus().equals(ProfileStatus.ACTIVE)) {
            throw new EmailAlreadyVerifiedException("User is already verified");
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
        userActivityService.updateLastSeen(email);
    }

    @Override
    @Transactional
    public void setUserActiveStatus(String email, boolean isActive) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            if (isActive) {
                userActivityService.updateLastSeenStatus(email);
            }else{
                userActivityService.markUserInactive(email);
            }
        }
    }

    @Override
    @Transactional
    public void suspendOrUnSuspendUser(Integer userId, String action) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
        if (action.equals("suspend")) {
            user.setProfileStatus(ProfileStatus.SUSPENDED);
        } else if (action.equals("unsuspend")) {
            user.setProfileStatus(ProfileStatus.ACTIVE);
        } else {
            throw new IllegalArgumentException("Invalid action: " + action);
        }
        userRepository.save(user);
    }

    @Transactional(readOnly = true)
    public Page<User> getUsersByFilters(String status, String searchTerm, Pageable pageable) {
        logger.debug("Fetching users with search term: {}, pagination: {}", searchTerm, pageable);

        ProfileStatus profileStatus = null;
        if (status != null && !status.isEmpty()) {
            try {
                profileStatus = ProfileStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                logger.error("Invalid profile status: {}", status);
                throw new InvalidRequestException("Invalid profile status: " + status);
            }
        }

        // Normalize search term
        String normalizedSearch = searchTerm != null ? searchTerm.trim() : null;
        if (normalizedSearch != null && normalizedSearch.isEmpty()) {
            normalizedSearch = null;
        }

        Page<User> users;
        if (normalizedSearch == null) {
            users = userRepository.findUsersWithFilters(profileStatus, pageable);
        } else {
            users = userRepository.findUsersWithFilters(profileStatus, normalizedSearch, pageable);
        }

        logger.debug("Found {} users in page {} of {}",
                users.getNumberOfElements(),
                users.getNumber(),
                users.getTotalPages());

        return users;
    }


    @Override
    @Transactional(readOnly = true)
    public UserDataResponseDTO getUserData(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));

        List<Session> sessions;
        List<Appointment> appointments = null;

        if (user.getRole() == Role.LISTENER) {
            sessions = sessionRepository.findByListener_ListenerId(userId);
        } else {
            sessions = sessionRepository.findByUser_UserId(userId);
            appointments = appointmentRepository.findByUser_UserId(userId);
        }
        if (appointments == null) {
            appointments = Collections.emptyList();
        }
        if(sessions == null){
            sessions = Collections.emptyList();
        }

        return UserMapper.toUserDataResponseDTO(user, sessions, appointments);
    }

    public void sendDataRequestVerificationEmail(String email) {
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserNotFoundException("User not found with email: " + email);
        }
        String token = UUID.randomUUID().toString().replaceAll("[^0-9]", "").substring(0, 6);
        EmailVerification emailVerification = new EmailVerification();
        emailVerification.setUserId(user.getUserId());
        emailVerification.setVerificationCode(token);
        emailVerification.setEmail(email);
        emailVerification.setExpiryTime(LocalDateTime.now().plusHours(24));
        emailVerification.setStatus("pending");
        emailVerification.setCreatedAt(LocalDateTime.now());
        emailVerificationRepository.save(emailVerification);

        emailService.sendDataRequestVerificationEmail(user.getEmail(), token);
    }
    @Override
    public void verifyDataRequestCode(String verificationCode) {
        EmailVerification emailVerification = emailVerificationRepository.findByVerificationCode(verificationCode)
                .orElseThrow(() -> new InvalidVerificationCodeException("Invalid verification code"));

        if (emailVerification.getExpiryTime().isBefore(LocalDateTime.now())) {
            throw new InvalidVerificationCodeException("Verification code has expired");
        }

        emailVerification.setStatus("verified");
        emailVerificationRepository.save(emailVerification);
    }
}