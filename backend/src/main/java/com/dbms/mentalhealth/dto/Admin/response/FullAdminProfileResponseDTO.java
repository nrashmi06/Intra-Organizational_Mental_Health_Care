package com.dbms.mentalhealth.dto.Admin.response;

import lombok.Data;

import java.time.LocalDateTime;

@Data
public class FullAdminProfileResponseDTO {
    private Integer adminId;
    private Integer userId;
    private String fullName;
    private String adminNotes;
    private String qualifications;
    private String contactNumber;
    private String email;
    private String profilePictureUrl;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int totalAppointments;
    private LocalDateTime lastAppointmentDate;
    private int totalBlogsPublished;
    private int totalLikesReceived;
    private int totalViewsReceived;
}
