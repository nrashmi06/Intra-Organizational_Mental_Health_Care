package com.dbms.mentalhealth.dto.user.request;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserRegistrationRequestDTO {
    private String email;
    private String password;
    private String anonymousName;
}