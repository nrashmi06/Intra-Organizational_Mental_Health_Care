package com.dbms.mentalhealth.dto.user.request;

import lombok.Data;

@Data
public class UserLoginRequestDTO {
    private String email;
    private String password;
}