package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.dto.Listener.response.ListenerDetailsResponseDTO;
import com.dbms.mentalhealth.dto.UserActivity.UserActivityDTO;

import java.util.List;

public interface ListenerService {
    ListenerDetailsResponseDTO getListenerDetails(String type, Integer id);
    List<UserActivityDTO> getAllListeners();
    String suspendOrUnsuspendListener(Integer listenerId, String action);
    void incrementMessageCount(String username);
}