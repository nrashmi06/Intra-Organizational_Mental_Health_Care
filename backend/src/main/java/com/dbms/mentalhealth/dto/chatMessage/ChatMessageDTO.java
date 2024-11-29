package com.dbms.mentalhealth.dto.chatMessage;

import com.dbms.mentalhealth.enums.MessageType;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ChatMessageDTO {
    private MessageType type;
    private String sender;
    private String content;
}