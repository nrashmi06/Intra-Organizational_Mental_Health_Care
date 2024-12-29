package com.dbms.mentalhealth.dto.Admin.response;

import lombok.Data;
import java.time.LocalDateTime;
@Data
public class AdminProfileResponseDTO {
    private Integer adminId;
    private Integer userId;
    private String fullName;
    private String adminNotes;
    private String qualifications;
    private String contactNumber;
    private String email;
    private String profilePictureUrl; // New field for profile picture URL
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}