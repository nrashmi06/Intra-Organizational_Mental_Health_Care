// ChatMessageServiceImpl.java
package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.model.ChatMessage;
import com.dbms.mentalhealth.repository.ChatMessageRepository;
import com.dbms.mentalhealth.service.ChatMessageService;
import jakarta.transaction.Transactional;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Slf4j
public class ChatMessageServiceImpl implements ChatMessageService {

    private final ChatMessageRepository chatMessageRepository;

    @Autowired
    public ChatMessageServiceImpl(ChatMessageRepository chatMessageRepository) {
        this.chatMessageRepository = chatMessageRepository;
    }

    @Transactional
    public void saveMessages(List<ChatMessage> messages) {
        chatMessageRepository.saveAll(messages);
        log.info("Batch saved {} messages", messages.size());
    }


}