package com.dbms.mentalhealth.dto.Listener.response;
import lombok.Data;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Data
public class ListenerDetailsResponseDTO {
    private Integer listenerId;
    private String userEmail;
    private boolean canApproveBlogs;
    private int totalSessions;
    private Integer totalMessagesSent;
    private Integer feedbackCount;
    private BigDecimal averageRating;
    private LocalDateTime joinedAt;
    private String approvedBy;
}