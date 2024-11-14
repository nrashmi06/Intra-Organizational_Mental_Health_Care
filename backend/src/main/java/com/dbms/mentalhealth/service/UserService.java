package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.dto.user.request.UserRegistrationRequestDTO;
import com.dbms.mentalhealth.dto.user.response.UserRegistrationResponseDTO;
import com.dbms.mentalhealth.mapper.UserMapper;
import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    private final UserRepository userRepository;

    @Autowired
    public UserService(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    public UserRegistrationResponseDTO registerUser(UserRegistrationRequestDTO userRegistrationDTO) {
        User user = UserMapper.toEntity(userRegistrationDTO);
        user = userRepository.save(user);
        return new UserRegistrationResponseDTO(user.getUserId(), user.getAnonymousName(), user.getEmail(), user.getRole());
    }
}