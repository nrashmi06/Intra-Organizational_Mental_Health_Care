package com.dbms.mentalhealth.dto.user.response;
import com.dbms.mentalhealth.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserRegistrationResponseDTO {
    private Integer userId;
    private String email;
    private String anonymousName;
    private Role role;
}