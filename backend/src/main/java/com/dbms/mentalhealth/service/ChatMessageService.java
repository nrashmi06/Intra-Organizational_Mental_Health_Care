// ChatMessageService.java
package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.model.ChatMessage;

public interface ChatMessageService {
    ChatMessage saveMessage(ChatMessage chatMessage);
}