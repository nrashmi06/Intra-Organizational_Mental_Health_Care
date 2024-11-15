package com.dbms.mentalhealth.dto.user.response;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserLoginResponseDTO {
    private Integer userId;
    private String email;
    private String anonymousName;
    private String role;
    private String token;
}