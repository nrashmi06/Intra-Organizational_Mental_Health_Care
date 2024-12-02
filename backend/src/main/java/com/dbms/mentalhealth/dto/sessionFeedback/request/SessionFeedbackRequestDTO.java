package com.dbms.mentalhealth.dto.sessionFeedback.request;

import lombok.Data;

@Data
public class SessionFeedbackRequestDTO {
    private Integer sessionId;
    private Integer rating;
    private String comments;
}