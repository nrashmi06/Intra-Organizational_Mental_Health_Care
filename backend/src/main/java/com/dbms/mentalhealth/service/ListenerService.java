package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.dto.Listener.response.ListenerDetailsResponseDTO;

public interface ListenerService {
    ListenerDetailsResponseDTO getListenerDetails(String type, Integer id);
}