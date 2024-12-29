package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.dto.Listener.response.ListenerDetailsResponseDTO;
import com.dbms.mentalhealth.dto.UserActivity.UserActivityDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ListenerService {
    ListenerDetailsResponseDTO getListenerDetails(String type, Integer id);
    Page<UserActivityDTO> getListenersByFilters(String status, String searchTerm, Pageable pageable);
    String suspendOrUnsuspendListener(Integer listenerId, String action);
    void incrementMessageCount(String username);
}