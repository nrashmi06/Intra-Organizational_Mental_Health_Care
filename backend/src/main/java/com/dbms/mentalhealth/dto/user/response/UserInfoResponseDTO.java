package com.dbms.mentalhealth.dto.user.response;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class UserInfoResponseDTO {
    private Integer id;
    private String email;
    private String anonymousName;
    private String role;
    private boolean isActive;
    private String profileStatus;
    private String createdAt;
    private String updatedAt;
    private String lastSeen;
    private String error; // Add an error field for error messages
    //need to add session field later


    // Constructor for error case
    public UserInfoResponseDTO(String error) {
        this.error = error;
    }
}
