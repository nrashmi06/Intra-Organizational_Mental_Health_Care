package com.dbms.mentalhealth.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "listeners")
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Listener {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer listenerId;

    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "can_approve_blogs", nullable = false)
    private boolean canApproveBlogs;

    @Column(name = "max_daily_sessions")
    private Integer maxDailySessions;

    @Column(name = "total_sessions")
    private Integer totalSessions;

    @Column(name = "average_rating", precision = 3, scale = 2)
    private BigDecimal averageRating;

    @Column(name = "total_messages_sent")
    private Integer totalMessagesSent;

    @Column(name = "joined_at", nullable = false)
    private LocalDateTime joinedAt;

    @Column(name = "approved_by", nullable = false)
    private String approvedBy;
}
