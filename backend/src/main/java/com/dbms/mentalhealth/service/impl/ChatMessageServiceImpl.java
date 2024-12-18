// ChatMessageServiceImpl.java
package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.model.ChatMessage;
import com.dbms.mentalhealth.repository.ChatMessageRepository;
import com.dbms.mentalhealth.service.ChatMessageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ChatMessageServiceImpl implements ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;

    @Autowired
    public ChatMessageServiceImpl(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    @Override
    public ChatMessage saveMessage(ChatMessage chatMessage) {
        return chatMessageRepository.save(chatMessage);
    }

    @Override
    public List<ChatMessage> getMessagesBySessionId(Integer sessionId) {
        return chatMessageRepository.findBySession_SessionId(sessionId);
    }

}