// ChatMessageService.java
package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.model.ChatMessage;
import java.util.List;

public interface ChatMessageService {
    void saveMessages(List<ChatMessage> messages);
}