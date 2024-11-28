package com.dbms.mentalhealth.mapper;

import com.dbms.mentalhealth.dto.notification.response.NotificationResponseDTO;
import com.dbms.mentalhealth.model.Notification;

public class NotificationMapper {

    public static NotificationResponseDTO toNotificationResponseDTO(Notification notification) {
        NotificationResponseDTO dto = new NotificationResponseDTO();
        dto.setNotificationId(notification.getNotificationId());
        dto.setSenderId(notification.getSender().getUserId());
        dto.setMessage(notification.getMessage());
        dto.setSentAt(notification.getSentAt());
        return dto;
    }
}