package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.dto.Listener.response.FullListenerDetailsDTO;
import com.dbms.mentalhealth.dto.Listener.response.ListenerDetailsResponseDTO;
import com.dbms.mentalhealth.dto.UserActivity.UserActivityDTO;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ListenerService {
    FullListenerDetailsDTO getListenerDetails(String type, Integer id);
    Page<UserActivityDTO> getListenersByFilters(String status, String searchTerm, Pageable pageable);
    String suspendOrUnsuspendListener(Integer listenerId, String action);
    void incrementMessageCount(String username, Integer count);
}