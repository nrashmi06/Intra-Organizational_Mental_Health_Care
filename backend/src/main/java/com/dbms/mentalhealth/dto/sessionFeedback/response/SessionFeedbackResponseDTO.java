package com.dbms.mentalhealth.dto.sessionFeedback.response;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SessionFeedbackResponseDTO {
    private Integer feedbackId;
    private Integer sessionId;
    private Integer userId;
    private Integer rating;
    private String comments;
    private LocalDateTime submittedAt;
}