package com.dbms.mentalhealth.dto.user.response;

import com.dbms.mentalhealth.enums.ProfileStatus;
import com.dbms.mentalhealth.enums.Role;
import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class FullUserDetailsDTO {
    private Integer userId;
    private String email;
    private String anonymousName;
    private Role role;
    private Boolean isActive;
    private ProfileStatus profileStatus;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime lastSeen;
    private int totalSessionsAttended;
    private LocalDateTime lastSessionDate;
    private int totalAppointments;
    private LocalDateTime lastAppointmentDate;
    private int totalMessagesSent;
    private int totalBlogsPublished;
    private int totalLikesReceived;
    private int totalViewsReceived;
}