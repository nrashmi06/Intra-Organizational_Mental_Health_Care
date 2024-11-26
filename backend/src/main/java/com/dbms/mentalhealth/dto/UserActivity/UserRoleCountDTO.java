package com.dbms.mentalhealth.dto.UserActivity;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserRoleCountDTO {
    private final String role;
    private final int count;
}