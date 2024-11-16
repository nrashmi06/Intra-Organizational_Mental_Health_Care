package com.dbms.mentalhealth.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.Getter;

import java.time.LocalDateTime;

@Entity
@Table(name = "email_verifications")
@Data
public class EmailVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private int verificationId;

    @Column(nullable = false)
    private int userId;

    @Column(nullable = false, length = 10)
    private String verificationCode;

    @Column(nullable = false)
    private LocalDateTime expiryTime;

    @Column(nullable = false, length = 20)
    private String status;

    @Column(nullable = false)
    private LocalDateTime createdAt;

    // Getters and setters
}