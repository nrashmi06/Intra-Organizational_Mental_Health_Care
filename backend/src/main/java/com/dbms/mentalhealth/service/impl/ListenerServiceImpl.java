package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.Listener.response.ListenerDetailsResponseDTO;
import com.dbms.mentalhealth.dto.UserActivity.UserActivityDTO;
import com.dbms.mentalhealth.enums.ProfileStatus;
import com.dbms.mentalhealth.enums.Role;
import com.dbms.mentalhealth.exception.appointment.InvalidRequestException;
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
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class ListenerServiceImpl implements ListenerService {

    private static final org.slf4j.Logger logger = org.slf4j.LoggerFactory.getLogger(ListenerServiceImpl.class);
    private final ListenerRepository listenerRepository;
    private final UserRepository userRepository;

    @Autowired
    public ListenerServiceImpl(ListenerRepository listenerRepository, UserRepository userRepository) {
        this.listenerRepository = listenerRepository;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional(readOnly = true)
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
    @Transactional(readOnly = true)
    public Page<UserActivityDTO> getListenersByFilters(String status, String searchTerm, Pageable pageable) {
        logger.debug("Fetching listeners with status: {}, search term: {}, pagination: {}",
                status, searchTerm, pageable);

        ProfileStatus profileStatus = null;
        if (status != null && !status.isEmpty()) {
            try {
                profileStatus = ProfileStatus.valueOf(status.toUpperCase());
            } catch (IllegalArgumentException e) {
                logger.error("Invalid profile status: {}", status);
                throw new InvalidRequestException("Invalid profile status: " + status);
            }
        }

        // Normalize search term - modified logic
        String normalizedSearch = null;
        if (searchTerm != null) {
            String trimmed = searchTerm.trim();
            if (!trimmed.isEmpty()) {
                normalizedSearch = trimmed;
            }
        }

        Page<Listener> listeners = listenerRepository.findListenersWithFilters(profileStatus, normalizedSearch, pageable);
        return listeners.map(listener -> UserActivityMapper.toUserActivityDTO(listener.getUser()));
    }

    @Override
    @Transactional
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
    @Transactional
    public void incrementMessageCount(String username) {
        listenerRepository.incrementMessageCount(username);
    }
}
