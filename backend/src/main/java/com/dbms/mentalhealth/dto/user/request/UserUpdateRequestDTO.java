package com.dbms.mentalhealth.dto.user.request;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserUpdateRequestDTO {
    private String anonymousName;  // For updating anonymous name
    private String role;           // For updating role (admin only)
    private String profileStatus;
}