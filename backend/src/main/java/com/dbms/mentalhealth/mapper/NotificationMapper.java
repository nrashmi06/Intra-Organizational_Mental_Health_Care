package com.dbms.mentalhealth.mapper;

import com.dbms.mentalhealth.dto.notification.response.NotificationResponseDTO;
import com.dbms.mentalhealth.model.Notification;
import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.extern.slf4j.Slf4j;
import org.springframework.lang.NonNull;
import org.springframework.util.Assert;

import java.io.IOException;

@Slf4j
public class NotificationMapper {
    private static final ObjectMapper objectMapper = new ObjectMapper();

    /**
     * Converts a Notification entity to NotificationResponseDTO.
     * Handles nested JSON messages.
     *
     * @param notification The source Notification entity
     * @return NotificationResponseDTO with mapped properties
     * @throws IllegalArgumentException if notification is null
     */
    public static NotificationResponseDTO toNotificationResponseDTO(@NonNull Notification notification) {
        // Validate input
        Assert.notNull(notification, "Notification cannot be null");
        Assert.notNull(notification.getSender(), "Notification sender cannot be null");

        // Extract actual message from potentially nested JSON
        String finalMessage = extractActualMessage(notification.getMessage());

        return NotificationResponseDTO.builder()
                .notificationId(notification.getNotificationId())
                .senderId(notification.getSender().getUserId())
                .message(finalMessage)
                .sentAt(notification.getSentAt())
                .build();
    }

    /**
     * Extracts the actual message from potentially nested JSON
     *
     * @param originalMessage The original message string
     * @return Extracted message or original message if not a nested JSON
     */
    private static String extractActualMessage(String originalMessage) {
        try {
            // Try to parse as JSON
            JsonNode rootNode = objectMapper.readTree(originalMessage);

            // Check if there's a nested "message" field
            if (rootNode.has("message")) {
                return rootNode.get("message").asText();
            }

            // If no nested message, return original
            return originalMessage;
        } catch (IOException e) {
            // If not a valid JSON, return original message
            log.warn("Could not parse message as JSON: {}", originalMessage);
            return originalMessage;
        }
    }

    // Prevent instantiation
    private NotificationMapper() {
        throw new AssertionError("Cannot instantiate utility class");
    }
}