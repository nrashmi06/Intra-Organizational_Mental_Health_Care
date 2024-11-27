package com.dbms.mentalhealth.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "session_feedback")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class SessionFeedback {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "feedback_id")
    private Integer feedbackId;

    @ManyToOne
    @JoinColumn(name = "session_id", nullable = false)
    private Session session;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "rating", nullable = false)
    private Integer rating;

    @Column(name = "comments", columnDefinition = "TEXT")
    private String comments;

    @Column(name = "submitted_at", nullable = false)
    private LocalDateTime submittedAt;
}