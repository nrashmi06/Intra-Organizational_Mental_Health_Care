package com.dbms.mentalhealth.service.impl;
import com.dbms.mentalhealth.dto.user.request.UserLoginRequestDTO;
import com.dbms.mentalhealth.dto.user.request.UserRegistrationRequestDTO;
import com.dbms.mentalhealth.dto.user.request.UserUpdateRequestDTO;
import com.dbms.mentalhealth.dto.user.response.*;
import com.dbms.mentalhealth.enums.ProfileStatus;
import com.dbms.mentalhealth.enums.Role;
import com.dbms.mentalhealth.exception.appointment.InvalidRequestException;
import com.dbms.mentalhealth.exception.user.*;
import com.dbms.mentalhealth.mapper.UserMapper;
import com.dbms.mentalhealth.model.*;
import com.dbms.mentalhealth.repository.*;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.EmailService;
import com.dbms.mentalhealth.service.RefreshTokenService;
import com.dbms.mentalhealth.service.UserActivityService;
import com.dbms.mentalhealth.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import jakarta.servlet.http.Cookie;
import jakarta.servlet.http.HttpServletResponse;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.core.AuthenticationException;
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

@Service
@Slf4j
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
    private final UserMetricsRepository userMetricsRepository;

    public UserServiceImpl(UserRepository userRepository, UserActivityService userActivityService, RefreshTokenService refreshTokenService, JwtUtils jwtUtils, @Lazy AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder, EmailVerificationRepository emailVerificationRepository, EmailService emailService, SessionRepository sessionRepository, AppointmentRepository appointmentRepository, UserMetricsRepository userMetricsRepository) {
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
        this.userMetricsRepository = userMetricsRepository;
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

    @Transactional
    public Map<String, Object> loginUser(UserLoginRequestDTO loginRequest) {
        log.debug("Processing login for user: {}", loginRequest.getEmail());

        // Authenticate user
        Authentication authentication;
        try {
            authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );
        } catch (AuthenticationException e) {
            log.warn("Authentication failed for user: {}", loginRequest.getEmail());
            throw new InvalidUserCredentialsException("Invalid email or password");
        }

        // Get user details after authentication
        UserDetails userDetails = (UserDetails) authentication.getPrincipal();
        User user = userRepository.findByEmail(userDetails.getUsername());

        if (user == null) {
            log.error("User not found after authentication: {}", userDetails.getUsername());
            throw new UsernameNotFoundException("User not found");
        }

        // Verify user status
        if (!user.getProfileStatus().equals(ProfileStatus.ACTIVE)) {
            log.warn("Inactive user attempted login: {}", user.getEmail());
            throw new UserNotActiveException("User account is not active");
        }

        // Update user status and last seen
        setUserActiveStatus(user.getEmail(), true);
        user.setLastSeen(LocalDateTime.now());
        userRepository.save(user);

        // Generate tokens
        String accessToken = jwtUtils.generateTokenFromUsername(userDetails, user.getUserId());
        String refreshToken = refreshTokenService.createRefreshToken(user.getEmail()).getToken();
        UserLoginResponseDTO userDTO = UserMapper.toUserLoginResponseDTO(user);

        // Create response
        Map<String, Object> response = new HashMap<>();
        response.put("user", userDTO);
        response.put("accessToken", accessToken);
        response.put("refreshToken", refreshToken);

        log.info("Login successful for user: {}", user.getEmail());
        return response;
    }

    private boolean isValidEmail(String email) {
        // Regular expression for validating an email address
        String emailRegex = "^[a-zA-Z0-9_+&*-]+(?:\\.[a-zA-Z0-9_+&*-]+)*@(?:[a-zA-Z0-9-]+\\.)+[a-zA-Z]{2,7}$";
        return email != null && email.matches(emailRegex);
    }

    @Transactional
    public UserRegistrationResponseDTO registerUser(UserRegistrationRequestDTO userRegistrationDTO) {
        if (!isValidEmail(userRegistrationDTO.getEmail())) {
            throw new InvalidEmailException("Invalid email format: " + userRegistrationDTO.getEmail());
        }

        if (userRepository.existsByEmail(userRegistrationDTO.getEmail())) {
            throw new EmailAlreadyInUseException("Email is already in use: " + userRegistrationDTO.getEmail());
        }

        // Trim the anonymous name before validation
        String trimmedAnonymousName = userRegistrationDTO.getAnonymousName().replaceAll("\\s+", "");
        if (!isValidUsername(trimmedAnonymousName)) {
                throw new InvalidUsernameException("Invalid username: " + trimmedAnonymousName + ". Please try another.");
        }

        if (userRepository.existsByAnonymousName(trimmedAnonymousName)) {
            throw new AnonymousNameAlreadyInUseException("Anonymous name is already in use: " + trimmedAnonymousName);
        }

        try {
            User user = UserMapper.toEntity(userRegistrationDTO, passwordEncoder.encode(userRegistrationDTO.getPassword()));
            user.setAnonymousName(trimmedAnonymousName); // Set the trimmed anonymous name
            userRepository.save(user);

            // Create and save UserMetrics for the new user
            UserMetrics userMetrics = new UserMetrics();
            userMetrics.setUser(user);
            userMetricsRepository.save(userMetrics);

            return UserMapper.toRegistrationResponseDTO(user);
        } catch (Exception e) {
            throw new ResponseStatusException(HttpStatus.INTERNAL_SERVER_ERROR, "An error occurred while registering the user", e);
        }
    }

    private boolean isValidUsername(String username) {
        return username != null &&
                !username.trim().isEmpty() &&
                username.matches("^[a-zA-Z0-9 ._-]{3,}$");
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

    @Override
    public FullUserDetailsDTO getFullUserDetailsById(Integer userId) {
        Integer loggedInUserId = jwtUtils.getUserIdFromContext();
        boolean isAdmin = jwtUtils.isAdminFromContext();
        if (!isAdmin && !userId.equals(loggedInUserId)) {
            throw new ResponseStatusException(HttpStatus.FORBIDDEN, "You are not authorized to view this user");
        }
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
        UserMetrics userMetrics = userMetricsRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new UserNotFoundException("UserMetrics not found for user: " + userId));
        return UserMapper.toFullUserDetailsDTO(user, userMetrics);
    }

    @Override
    public UserInfoResponseDTO getUserInfoById(Integer userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new UserNotFoundException("User not found with ID: " + userId));
        return UserMapper.toInfoResponseDTO(user);
    }

    public void updateUserBasedOnRole(Integer userId, UserUpdateRequestDTO userUpdateDTO, Authentication authentication) {
        // Fetch authenticated user's role
        String authenticatedUserRole = jwtUtils.getRoleFromContext();

        if (authenticatedUserRole.equals("ROLE_ADMIN")) {
            // Admin update
            updateUserAsAdmin(userId, userUpdateDTO);
        } else if ((authenticatedUserRole.equals("ROLE_USER")||(authenticatedUserRole.equals("ROLE_LISTENER"))) && userUpdateDTO.getAnonymousName() != null) {
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

        // Check if anonymous name is unique
        if (userUpdateDTO.getAnonymousName() != null && !userUpdateDTO.getAnonymousName().equals(userToUpdate.getAnonymousName())) {
            if (userRepository.existsByAnonymousName(userUpdateDTO.getAnonymousName())) {
                throw new AnonymousNameAlreadyInUseException("Anonymous name is already in use: " + userUpdateDTO.getAnonymousName());
            }
            userToUpdate.setAnonymousName(userUpdateDTO.getAnonymousName());
        }

        // Update profile status
        if (userUpdateDTO.getProfileStatus() != null) {
            userToUpdate.setProfileStatus(ProfileStatus.valueOf(userUpdateDTO.getProfileStatus()));
        }

        userRepository.save(userToUpdate);
    }

    private void updateAnonymousName(Integer userId, String anonymousName) {
        User userToUpdate = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        // Check if anonymous name is unique
        if (!anonymousName.equals(userToUpdate.getAnonymousName()) && userRepository.existsByAnonymousName(anonymousName)) {
            throw new AnonymousNameAlreadyInUseException("Anonymous name is already in use: " + anonymousName);
        }

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

    public void clearCookies(HttpServletResponse response,String baseUrl) {
        log.info("Clearing refresh token cookie");

        boolean isSecure = !baseUrl.contains("localhost");
        String sameSite = isSecure ? "None" : "Lax"; // Use Lax for localhost

        // Create cookie with security attributes and max-age=0
        Cookie refreshTokenCookie = new Cookie("refreshToken", null);
        refreshTokenCookie.setHttpOnly(true);
        refreshTokenCookie.setSecure(isSecure);
        refreshTokenCookie.setPath("/");
        refreshTokenCookie.setMaxAge(0); // Expire immediately

        // Set domain for non-localhost environments
        if (!baseUrl.contains("localhost")) {
            String domain = baseUrl.replaceAll("https?://", "")
                    .replaceAll("/.*$", "")
                    .split(":")[0]
                    .trim();
            refreshTokenCookie.setDomain(domain);
        }

        // Add cookie to response
        response.addCookie(refreshTokenCookie);

        // Set explicit cookie header for additional browser compatibility
        String cookieString = String.format(
                "refreshToken=; Path=/; HttpOnly; Max-Age=0; SameSite=%s%s",
                sameSite,
                isSecure ? "; Secure" : ""
        );

        if (!baseUrl.contains("localhost")) {
            cookieString += "; Domain=" + refreshTokenCookie.getDomain();
        }

        response.setHeader("Set-Cookie", cookieString);

        log.info("Cookie cleared - Path: /, MaxAge: 0, Secure: {}, SameSite: {}",
                isSecure, sameSite);
    }

}