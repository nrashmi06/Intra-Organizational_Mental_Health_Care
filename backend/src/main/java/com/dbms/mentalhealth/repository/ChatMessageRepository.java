package com.dbms.mentalhealth.repository;

import com.dbms.mentalhealth.model.ChatMessage;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChatMessageRepository extends JpaRepository<ChatMessage, Integer> {

}
