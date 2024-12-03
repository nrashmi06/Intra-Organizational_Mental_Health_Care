package com.dbms.mentalhealth.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "session_reports")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionReport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "report_id")
    private Integer reportId;

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne
    @JoinColumn(name = "listener_id", nullable = false)
    private Listener listener;

    @Column(name = "report_content", nullable = false, columnDefinition = "TEXT")
    private String reportContent;

    @Column(name = "severity_level", nullable = false, length = 20)
    private Integer severityLevel;

    @Column(name = "created_at", nullable = false)
    private LocalDateTime createdAt;
}