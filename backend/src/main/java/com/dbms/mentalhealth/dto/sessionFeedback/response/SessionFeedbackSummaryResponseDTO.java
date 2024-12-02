package com.dbms.mentalhealth.dto.sessionFeedback.response;

import lombok.Data;

@Data
public class SessionFeedbackSummaryResponseDTO {
    private Integer feedbackId;
    private Integer sessionId;
    private Integer userId;
    private Integer rating;
    private String comments;
}