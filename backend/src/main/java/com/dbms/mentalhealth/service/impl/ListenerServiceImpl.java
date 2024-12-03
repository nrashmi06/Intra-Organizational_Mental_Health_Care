package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.Listener.response.ListenerDetailsResponseDTO;
import com.dbms.mentalhealth.dto.UserActivity.UserActivityDTO;
import com.dbms.mentalhealth.enums.ProfileStatus;
import com.dbms.mentalhealth.enums.Role;
import com.dbms.mentalhealth.exception.listener.ListenerNotFoundException;
import com.dbms.mentalhealth.exception.user.UserNotFoundException;
import com.dbms.mentalhealth.mapper.ListenerDetailsMapper;
import com.dbms.mentalhealth.mapper.UserActivityMapper;
import com.dbms.mentalhealth.model.Listener;
import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.repository.ListenerRepository;
import com.dbms.mentalhealth.repository.UserRepository;
import com.dbms.mentalhealth.service.ListenerService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

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

    @Override
    public List<UserActivityDTO> getAllListeners() {
        List<Listener> listeners = listenerRepository.findAll();
        return listeners.stream()
                .map(listener -> UserActivityMapper.toUserActivityDTO(listener.getUser()))
                .toList();
    }

    @Override
    public String suspendOrUnsuspendListener(Integer listenerId, String action) {
        Listener listener = listenerRepository.findById(listenerId)
                .orElseThrow(() -> new RuntimeException("Listener not found for ID: " + listenerId));
        User user = listener.getUser();

        if ("suspend".equalsIgnoreCase(action)) {
            user.setRole(Role.USER);
            user.setProfileStatus(ProfileStatus.SUSPENDED);
            listenerRepository.save(listener);
            userRepository.save(user);
            return "Listener suspended successfully.";
        } else if ("unsuspend".equalsIgnoreCase(action)) {
            user.setProfileStatus(ProfileStatus.ACTIVE);
            user.setRole(Role.LISTENER);
            listenerRepository.save(listener);
            userRepository.save(user);
            return "Listener unsuspended successfully.";
        } else {
            throw new IllegalArgumentException("Invalid action: " + action);
        }
    }

    @Override
    public void incrementMessageCount(String username) {
        listenerRepository.incrementMessageCount(username);
    }
}
