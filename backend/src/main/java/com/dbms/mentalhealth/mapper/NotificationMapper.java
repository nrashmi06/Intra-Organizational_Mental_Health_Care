package com.dbms.mentalhealth.mapper;

import com.dbms.mentalhealth.dto.notification.NotificationResponseDTO;
import com.dbms.mentalhealth.model.Notification;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.util.Assert;

@Slf4j
public class NotificationMapper {

    /**
     * Converts a Notification entity to NotificationResponseDTO.
     *
     * @param notification The source Notification entity
     * @return NotificationResponseDTO with mapped properties
     * @throws IllegalArgumentException if notification is null
     */
    public static NotificationResponseDTO toNotificationResponseDTO(@NonNull Notification notification) {
        // Validate input
        Assert.notNull(notification, "Notification cannot be null");
        Assert.notNull(notification.getSender(), "Notification sender cannot be null");

        return NotificationResponseDTO.builder()
                .notificationId(notification.getNotificationId())
                .senderId(notification.getSender().getUserId())
                .message(notification.getMessage())
                .sentAt(notification.getSentAt())
                .build();
    }

    // Prevent instantiation
    private NotificationMapper() {
        throw new AssertionError("Cannot instantiate utility class");
    }
}
