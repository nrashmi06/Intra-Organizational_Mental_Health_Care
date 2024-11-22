package com.dbms.mentalhealth.model;

import com.dbms.mentalhealth.enums.ProfileStatus;
import com.dbms.mentalhealth.enums.Role;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "users")
@NoArgsConstructor
@AllArgsConstructor
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "user_id")
    private Integer userId;

    @Column(name = "email", nullable = false, length = 100, unique = true)
    private String email;

    @Column(name = "password", nullable = false)
    private String password;


    @Column(name = "anonymous_name", nullable = false, length = 50)
    private String anonymousName;


    @Enumerated(EnumType.STRING)
    @Column(name = "role", nullable = false, length = 50)
    private Role role;

    @Column(name = "is_active", nullable = false)
    private Boolean isActive = false;

    @Enumerated(EnumType.STRING)
    @Column(name = "profile_status", nullable = false)
    private ProfileStatus profileStatus; // Represents whether the user's profile is active in the system

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @Column(name = "last_seen")
    private LocalDateTime lastSeen;
    // PrePersist callback to set the createdAt field before the entity is saved
    @PrePersist
    public void onCreate() {
        LocalDateTime now = LocalDateTime.now();
        createdAt = now;
        updatedAt = now;
    }

    // PreUpdate callback to update the updatedAt field before the entity is updated
    @PreUpdate
    public void onUpdate() {
        updatedAt = LocalDateTime.now();
    }

}