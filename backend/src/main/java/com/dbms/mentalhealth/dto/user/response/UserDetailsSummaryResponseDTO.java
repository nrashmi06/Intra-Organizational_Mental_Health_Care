package com.dbms.mentalhealth.dto.user.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserDetailsSummaryResponseDTO {
    private Integer userId;
    private String email;
    private String anonymousName;
    private boolean isActive;
    private String profileStatus;
}