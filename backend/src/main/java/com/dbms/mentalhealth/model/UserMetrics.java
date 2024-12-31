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
    private int totalSessionsAttended = 0;

    @Column(name = "last_session_date")
    private LocalDateTime lastSessionDate;

    @Column(name = "total_appointments", nullable = false)
    private int totalAppointments = 0;

    @Column(name = "last_appointment_date")
    private LocalDateTime lastAppointmentDate;

    @Column(name = "total_messages_sent", nullable = false)
    private int totalMessagesSent = 0;

    @Column(name = "total_blogs_published", nullable = false)
    private int totalBlogsPublished = 0;

    @Column(name = "total_blog_likes_received", nullable = false)
    private int totalLikesReceived = 0;

    @Column(name = "total_blog_views_received", nullable = false)
    private int totalViewsReceived = 0;
}