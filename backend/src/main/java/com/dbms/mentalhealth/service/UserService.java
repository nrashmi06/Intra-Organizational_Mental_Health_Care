package com.dbms.mentalhealth.service;

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
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import jakarta.transaction.Transactional;
import org.springframework.context.annotation.Lazy;
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

import java.util.Collections;
import java.util.List;
import java.util.Optional;

@Service
public class UserService implements UserDetailsService {

    private final UserRepository userRepository;
    private final JwtUtils jwtUtils;
    private final AuthenticationManager authenticationManager;
    private final PasswordEncoder passwordEncoder;

    public UserService(UserRepository userRepository, JwtUtils jwtUtils, @Lazy AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.jwtUtils = jwtUtils;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
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

    private static List<GrantedAuthority> createAuthorities(Role role) {
        return Collections.singletonList(new SimpleGrantedAuthority("ROLE_" + role.name()));
    }

    public UserLoginResponseDTO loginUser(UserLoginRequestDTO userLoginDTO) {
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
        String token = jwtUtils.generateTokenFromUsername(userDetails);

        return new UserLoginResponseDTO(
                user.getUserId(),
                user.getEmail(),
                user.getAnonymousName(),
                user.getRole().name(),
                token
        );
    }

    @Transactional
    public UserRegistrationResponseDTO registerUser(UserRegistrationRequestDTO userRegistrationDTO) {
        if (userRepository.existsByEmail(userRegistrationDTO.getEmail())) {
            throw new IllegalArgumentException("Email is already in use: " + userRegistrationDTO.getEmail());
        }

        User user = new User();
        user.setAnonymousName(userRegistrationDTO.getAnonymousName());
        user.setPassword(passwordEncoder.encode(userRegistrationDTO.getPassword()));
        user.setRole(Role.USER);
        user.setEmail(userRegistrationDTO.getEmail());
        user.setIsActive(false);
        user.setProfileStatus(ProfileStatus.ACTIVE);

        userRepository.save(user);

        return new UserRegistrationResponseDTO(
                user.getUserId(),
                user.getEmail(),
                user.getAnonymousName(),
                user.getRole()
        );
    }

    public void setUserActiveStatus(String email, boolean isActive) {
        User user = userRepository.findByEmail(email);
        if (user != null) {
            user.setIsActive(isActive);
            userRepository.save(user);
        }
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
            // Return an error DTO if user is not found
            return new UserInfoResponseDTO("User not found with ID: " + userId);
        }

        // Return a DTO with user data if user is found
        return new UserInfoResponseDTO(
                user.get().getUserId(),
                user.get().getEmail(),
                user.get().getAnonymousName(),
                user.get().getRole().name(),
                user.get().getIsActive(),
                user.get().getProfileStatus().name(),
                user.get().getCreatedAt().toString(),
                user.get().getUpdatedAt().toString(),
                null
        );
    }

    public void updateUserByAdmin(Integer userId, UserUpdateRequestDTO userUpdateDTO) {
        User userToUpdate = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));

        // Update role if user is not an admin and new role is admin
        if (userUpdateDTO.getRole() != null && !userToUpdate.getRole().equals(Role.ADMIN) && userUpdateDTO.getRole().equals("ADMIN")) {
            userToUpdate.setRole(Role.valueOf(userUpdateDTO.getRole()));
        } else if(userToUpdate.getRole().equals(Role.ADMIN)){
            throw new IllegalArgumentException("Cannot update role of user with ADMIN role");
        }

        if (userUpdateDTO.getProfileStatus() != null) {
            userToUpdate.setProfileStatus(ProfileStatus.valueOf(userUpdateDTO.getProfileStatus()));
        }

        userRepository.save(userToUpdate);
    }

    public void updateAnonymousName(Integer userId, String anonymousName) {
        User userToUpdate = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User not found with ID: " + userId));
        userToUpdate.setAnonymousName(anonymousName);
        userRepository.save(userToUpdate);
    }




}
