package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.Listener.response.ListenerDetailsResponseDTO;
import com.dbms.mentalhealth.exception.listener.ListenerNotFoundException;
import com.dbms.mentalhealth.exception.user.UserNotFoundException;
import com.dbms.mentalhealth.mapper.ListenerDetailsMapper;
import com.dbms.mentalhealth.model.Listener;
import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.repository.ListenerRepository;
import com.dbms.mentalhealth.repository.UserRepository;
import com.dbms.mentalhealth.service.ListenerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class ListenerServiceImpl implements ListenerService {

    private final ListenerRepository listenerRepository;
    private final UserRepository userRepository;

    @Autowired
    public ListenerServiceImpl(ListenerRepository listenerRepository, UserRepository userRepository) {
        this.listenerRepository = listenerRepository;
        this.userRepository = userRepository;
    }

    @Override
    public ListenerDetailsResponseDTO getListenerDetails(String type, Integer id) {
        if ("userId".equalsIgnoreCase(type)) {
            User user = userRepository.findById(id)
                    .orElseThrow(() -> new UserNotFoundException("User not found for ID: " + id));
            return ListenerDetailsMapper.toResponseDTO(listenerRepository.findByUser(user)
                    .orElseThrow(() -> new ListenerNotFoundException("Listener not found for User ID: " + id)));
        } else if ("listenerId".equalsIgnoreCase(type)) {
            Listener listener = listenerRepository.findById(id)
                    .orElseThrow(() -> new ListenerNotFoundException("Listener not found for ID: " + id));
            return ListenerDetailsMapper.toResponseDTO(listener);
        } else {
            throw new IllegalArgumentException("Invalid type: " + type);
        }
    }
}