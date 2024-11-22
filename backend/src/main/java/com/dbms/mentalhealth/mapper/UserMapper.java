package com.dbms.mentalhealth.mapper;

import com.dbms.mentalhealth.dto.user.request.UserRegistrationRequestDTO;
import com.dbms.mentalhealth.dto.user.response.UserRegistrationResponseDTO;
import com.dbms.mentalhealth.dto.user.response.UserInfoResponseDTO;
import com.dbms.mentalhealth.dto.user.response.UserLoginResponseDTO;
import com.dbms.mentalhealth.enums.ProfileStatus;
import com.dbms.mentalhealth.enums.Role;
import com.dbms.mentalhealth.model.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public static User toEntity(UserRegistrationRequestDTO dto, String encodedPassword) {
        User user = new User();
        user.setAnonymousName(dto.getAnonymousName());
        user.setPassword(encodedPassword);
        user.setRole(Role.USER);
        user.setEmail(dto.getEmail());
        user.setIsActive(false);
        user.setProfileStatus(ProfileStatus.INACTIVE);
        return user;
    }

    public static UserRegistrationResponseDTO toRegistrationResponseDTO(User user) {
        return new UserRegistrationResponseDTO(
                user.getUserId(),
                user.getEmail(),
                user.getAnonymousName(),
                user.getRole()
        );
    }

    public static UserInfoResponseDTO toInfoResponseDTO(User user) {
        return new UserInfoResponseDTO(
                user.getUserId(),
                user.getEmail(),
                user.getAnonymousName(),
                user.getRole().name(),
                user.getIsActive(),
                user.getProfileStatus().name(),
                user.getCreatedAt().toString(),
                user.getUpdatedAt().toString(),
                null
        );
    }

    public static UserLoginResponseDTO toUserLoginResponseDTO(User user, String accessToken, String refreshToken) {
        return new UserLoginResponseDTO(
                user.getUserId(),
                user.getEmail(),
                user.getAnonymousName(),
                user.getRole().name(),
                accessToken,
                refreshToken
        );
    }
}