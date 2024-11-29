package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.model.ChatMessage;

public interface ChatService {
    ChatMessage processSendMessage(ChatMessage chatMessage, Integer sessionId);
    ChatMessage processAddUser(ChatMessage chatMessage, Integer sessionId);
    ChatMessage processRemoveUser(ChatMessage chatMessage, Integer sessionId);
}