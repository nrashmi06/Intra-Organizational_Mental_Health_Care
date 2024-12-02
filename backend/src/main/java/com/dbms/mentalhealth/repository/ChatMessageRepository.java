package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Integer> {
    List<ChatMessage> findBySession_SessionId(Integer sessionId);
}
