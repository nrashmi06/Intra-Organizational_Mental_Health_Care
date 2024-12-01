package com.dbms.mentalhealth.mapper;

import com.dbms.mentalhealth.dto.chatMessage.ChatMessageDTO;
import com.dbms.mentalhealth.model.ChatMessage;

public class ChatMessageMapper {
    public static ChatMessageDTO toChatMessageDTO(ChatMessage chatMessage) {
        return ChatMessageDTO.builder()
                .messageId(chatMessage.getMessageId())
                .sessionId(chatMessage.getSession().getSessionId())
                .senderName(chatMessage.getSender().getAnonymousName())
                .senderType(chatMessage.getSender().getRole().name())
                .senderId(chatMessage.getSender().getUserId())
                .messageContent(chatMessage.getMessageContent())
                .sentAt(chatMessage.getSentAt())
                .build();
    }
}