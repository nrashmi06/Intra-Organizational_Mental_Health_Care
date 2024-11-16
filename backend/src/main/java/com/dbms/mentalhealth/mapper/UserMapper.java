package com.dbms.mentalhealth.mapper;
import com.dbms.mentalhealth.dto.user.request.UserRegistrationRequestDTO;
import com.dbms.mentalhealth.dto.user.response.UserRegistrationResponseDTO;
import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.enums.Role;

public class UserMapper {

    public static User toEntity(UserRegistrationRequestDTO userRegistrationDTO) {
        User user = new User();
        user.setAnonymousName(userRegistrationDTO.getAnonymousName());
        user.setPassword(userRegistrationDTO.getPassword());
        user.setEmail(userRegistrationDTO.getEmail());
        user.setRole(Role.USER);
        return user;
    }

    public static UserRegistrationResponseDTO toResponseDTO(User user) {
        return new UserRegistrationResponseDTO(
                user.getUserId(),
                user.getAnonymousName(),
                user.getEmail(),
                user.getRole()
        );
    }
}
