package com.dbms.mentalhealth.dto.session;

import lombok.Data;

@Data
public class SessionSummaryDTO {
    private Integer sessionId;
    private Integer userId;
    private Integer listenerId;
    private String sessionStatus;
}