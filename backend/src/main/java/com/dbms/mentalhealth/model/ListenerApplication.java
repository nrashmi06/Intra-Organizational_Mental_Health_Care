package com.dbms.mentalhealth.model;

import com.dbms.mentalhealth.enums.ListenerApplicationStatus;
import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Entity
@Table(name = "listener_applications")
public class ListenerApplication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "application_id", nullable = false, updatable = false)
    private Integer applicationId;

    @OneToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "full_name", nullable = false, length = 100)
    private String fullName;

    @Column(name = "branch", nullable = false, length = 100)
    private String branch;

    @Column(name = "semester", nullable = false)
    private Integer semester;

    @Column(name = "usn", nullable = false, length = 20)
    private String usn;

    @Column(name = "phone_number", nullable = false, length = 15)
    private String phoneNumber;

    @Column(name = "certificate_url", nullable = false, length = 255)
    private String certificateUrl;

    @Enumerated(EnumType.STRING)
    @Column(name = "application_status", nullable = false, length = 20)
    private ListenerApplicationStatus applicationStatus;

    @Column(name = "submission_date", nullable = false)
    private LocalDateTime submissionDate;

    @ManyToOne
    @JoinColumn(name = "reviewed_by")
    private User reviewedBy;

    @Column(name = "reviewed_at")
    private LocalDateTime reviewedAt;
}