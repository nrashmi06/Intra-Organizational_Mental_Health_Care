package com.dbms.mentalhealth.dto.notification.response;

import com.dbms.mentalhealth.enums.NotificationStatus;
import lombok.Data;
import java.time.LocalDateTime;

@Data
public class NotificationResponseDTO {
    private Integer notificationId;
    private Integer senderId;
    private String message;
    private LocalDateTime sentAt;
}