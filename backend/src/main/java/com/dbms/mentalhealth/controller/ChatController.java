package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.model.ChatMessage;
import com.dbms.mentalhealth.service.ChatService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessageHeaderAccessor;
import org.springframework.stereotype.Controller;

@Controller
public class ChatController {

    private final ChatService chatService;

    @Autowired
    public ChatController(ChatService chatService) {
        this.chatService = chatService;
    }

    @MessageMapping("/sendMessage")
    @SendTo("/topic/session/{sessionId}")
    public ChatMessage sendMessage(
            @Payload ChatMessage chatMessage,
            @DestinationVariable Integer sessionId
    ) {
        return chatService.processSendMessage(chatMessage, sessionId);
    }

    @MessageMapping("/addUser")
    @SendTo("/topic/session/{sessionId}")
    public ChatMessage addUser(
            @Payload ChatMessage chatMessage,
            SimpMessageHeaderAccessor headerAccessor,
            @DestinationVariable Integer sessionId
    ) {
        if (headerAccessor.getSessionAttributes() == null) {
            throw new IllegalStateException("Session attributes are null");
        }
        headerAccessor.getSessionAttributes().put("username", chatMessage.getSender());
        headerAccessor.getSessionAttributes().put("sessionId", sessionId);
        return chatService.processAddUser(chatMessage, sessionId);
    }

    @MessageMapping("/removeUser")
    @SendTo("/topic/session/{sessionId}")
    public ChatMessage removeUser(
            @Payload ChatMessage chatMessage,
            @DestinationVariable Integer sessionId
    ) {
        return chatService.processRemoveUser(chatMessage, sessionId);
    }
}