package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.model.ChatMessage;
import com.dbms.mentalhealth.model.Session;
import com.dbms.mentalhealth.repository.SessionRepository;
import com.dbms.mentalhealth.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ChatServiceImpl implements ChatService {

    private final SessionRepository sessionRepository;

    @Autowired
    public ChatServiceImpl(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @Override
    public ChatMessage processSendMessage(ChatMessage chatMessage, Integer sessionId) {
        return processChatMessage(chatMessage, sessionId);
    }

    @Override
    public ChatMessage processAddUser(ChatMessage chatMessage, Integer sessionId) {
        return processChatMessage(chatMessage, sessionId);
    }

    @Override
    public ChatMessage processRemoveUser(ChatMessage chatMessage, Integer sessionId) {
        return processChatMessage(chatMessage, sessionId);
    }

    private ChatMessage processChatMessage(ChatMessage chatMessage, Integer sessionId) {
        Session session = sessionRepository.findById(sessionId)
                .orElseThrow(() -> new IllegalArgumentException("Invalid session ID"));
        chatMessage.setSession(session);
        return chatMessage;
    }
}