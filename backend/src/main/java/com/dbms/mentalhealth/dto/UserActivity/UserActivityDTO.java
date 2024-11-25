package com.dbms.mentalhealth.dto.UserActivity;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class UserActivityDTO {
    private Integer userId;
    private String anonymousName;
}