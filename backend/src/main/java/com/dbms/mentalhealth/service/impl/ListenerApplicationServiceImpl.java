package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.listenerApplication.request.ListenerApplicationRequestDTO;
import com.dbms.mentalhealth.dto.listenerApplication.response.ListenerApplicationResponseDTO;
import com.dbms.mentalhealth.enums.ListenerApplicationStatus;
import com.dbms.mentalhealth.mapper.ListenerApplicationMapper;
import com.dbms.mentalhealth.model.ListenerApplication;
import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.repository.ListenerApplicationRepository;
import com.dbms.mentalhealth.repository.UserRepository;
import com.dbms.mentalhealth.service.ImageStorageService;
import com.dbms.mentalhealth.service.ListenerApplicationService;
import com.dbms.mentalhealth.service.UserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.Optional;

@Service
public class ListenerApplicationServiceImpl implements ListenerApplicationService {

    private final ListenerApplicationRepository listenerApplicationRepository;
    private final ListenerApplicationMapper listenerApplicationMapper;
    private final ImageStorageService imageStorageService;
    private final UserService userService;
    private final UserRepository userRepository;

    @Autowired
    public ListenerApplicationServiceImpl(
            ListenerApplicationRepository listenerApplicationRepository,
            ListenerApplicationMapper listenerApplicationMapper,
            ImageStorageService imageStorageService,
            UserService userService,
            UserRepository userRepository) {
        this.listenerApplicationRepository = listenerApplicationRepository;
        this.listenerApplicationMapper = listenerApplicationMapper;
        this.imageStorageService = imageStorageService;
        this.userService = userService;
        this.userRepository = userRepository;
    }

    @Override
    @Transactional
    public ListenerApplicationResponseDTO submitApplication(
            ListenerApplicationRequestDTO applicationRequestDTO, MultipartFile certificate) throws Exception {
        // Extract email from security context
        String email = getUsernameFromContext(); // User name is email

        // Find user by email
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new RuntimeException("User not found for email: " + email);
        }

        // Map DTO to Entity with User
        ListenerApplication listenerApplication = ListenerApplicationMapper.toEntity(applicationRequestDTO, user);

        // Handle Certificate Upload
        String certificateUrl = imageStorageService.uploadImage(certificate);
        listenerApplication.setCertificateUrl(certificateUrl);

        // Set additional fields
        listenerApplication.setApplicationStatus(ListenerApplicationStatus.PENDING);
        listenerApplication.setSubmissionDate(LocalDateTime.now());

        // Save Listener Application
        ListenerApplication savedApplication = listenerApplicationRepository.save(listenerApplication);

        // Convert Entity to Response DTO
        return ListenerApplicationMapper.toResponseDTO(savedApplication);
    }

    @Override
    public ListenerApplicationResponseDTO getApplicationById(Integer applicationId) {
        // Find Listener Application by ID
        Optional<ListenerApplication> listenerApplication = listenerApplicationRepository.findById(applicationId);
        return listenerApplication.map(ListenerApplicationMapper::toResponseDTO)
                .orElseThrow(() -> new RuntimeException("Listener Application not found for ID: " + applicationId));
    }

    private String getUsernameFromContext() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return (principal instanceof UserDetails) ? ((UserDetails) principal).getUsername() : principal.toString();
    }
}
