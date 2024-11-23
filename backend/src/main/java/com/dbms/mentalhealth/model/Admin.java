package com.dbms.mentalhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "admins")
@Data
@AllArgsConstructor
@NoArgsConstructor
public class Admin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "admin_id")
    private Integer adminId;

    @Column(name = "full_name", length = 100, nullable = false)
    private String fullName;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false, unique = true)
    private User user; // One-to-one relationship with the user

    @Column(name = "profile_picture_url", length = 255, nullable = true)
    private String profilePictureUrl;

    @Column(name = "admin_notes", columnDefinition = "TEXT", nullable = true)
    private String adminNotes;

    @Column(name = "qualifications", length = 255, nullable = true)
    private String qualifications;

    @Column(name = "contact_number", length = 15, nullable = true)
    private String contactNumber;

    @Column(name = "email", length = 100, nullable = false)
    private String email;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
