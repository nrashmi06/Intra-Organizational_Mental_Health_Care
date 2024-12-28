package com.dbms.mentalhealth.dto.session.response;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class SessionResponseDTO {
    private Integer sessionId;
    private Integer userId;
    private Integer listenerId;
    private String sessionStatus;
    private LocalDateTime sessionStart;
    private LocalDateTime sessionEnd;
}