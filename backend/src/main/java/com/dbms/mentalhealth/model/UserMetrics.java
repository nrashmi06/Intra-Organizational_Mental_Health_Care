package com.dbms.mentalhealth.model;

import jakarta.persistence.*;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.AllArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "user_metrics")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class UserMetrics {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "u_metric_id")
    private Integer uMetricId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "total_sessions_attended", nullable = false)
    private int totalSessionsAttended;

    @Column(name = "last_session_date")
    private LocalDateTime lastSessionDate;

    @Column(name = "total_appointments", nullable = false)
    private int totalAppointments;

    @Column(name = "last_appointment_date")
    private LocalDateTime lastAppointmentDate;

    @Column(name = "total_feedback_given", nullable = false)
    private int totalFeedbackGiven;

    @Column(name = "last_feedback_date")
    private LocalDateTime lastFeedbackDate;

    @Column(name = "total_messages_sent", nullable = false)
    private int totalMessagesSent;

    @Column(name = "last_message_sent_date")
    private LocalDateTime lastMessageSentDate;
}