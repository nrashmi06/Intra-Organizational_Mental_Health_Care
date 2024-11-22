package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.listenerApplication.request.ListenerApplicationRequestDTO;
import com.dbms.mentalhealth.dto.listenerApplication.response.ListenerApplicationResponseDTO;
import com.dbms.mentalhealth.enums.ListenerApplicationStatus;
import com.dbms.mentalhealth.exception.ApplicationAlreadySubmittedException;
import com.dbms.mentalhealth.exception.UserNotFoundException;
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
import org.springframework.security.core.GrantedAuthority;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import static java.util.stream.Collectors.toList;

@Service
public class ListenerApplicationServiceImpl implements ListenerApplicationService {

    private final ListenerApplicationRepository listenerApplicationRepository;
    private final ImageStorageService imageStorageService;
    private final UserService userService;
    private final UserRepository userRepository;

    @Autowired
    public ListenerApplicationServiceImpl(
            ListenerApplicationRepository listenerApplicationRepository,
            ImageStorageService imageStorageService,
            UserService userService,
            UserRepository userRepository) {
        this.listenerApplicationRepository = listenerApplicationRepository;
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
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UserNotFoundException("User not found for email: " + email);
        }

        // Check if the user has already submitted an application
        if (listenerApplicationRepository.existsByUserEmail(email)) {
            throw new ApplicationAlreadySubmittedException("Application already submitted for email: " + email);
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
        // Extract email and role from security context
        String email = getUsernameFromContext();
        String role = getRoleFromContext();

        // Find Listener Application by ID
        Optional<ListenerApplication> listenerApplication = listenerApplicationRepository.findById(applicationId);

        // Check if the email matches or if the role is admin
        return listenerApplication.filter(application -> application.getUser().getEmail().equals(email) || "ROLE_ADMIN".equals(role))
                .map(ListenerApplicationMapper::toResponseDTO)
                .orElseThrow(() -> new RuntimeException("Listener Application not found or access denied for ID: " + applicationId));
    }


    @Override
    public void deleteApplication(Integer applicationId) {
        if (!listenerApplicationRepository.existsById(applicationId)) {
            throw new RuntimeException("Listener Application not found for ID: " + applicationId);
        }
        listenerApplicationRepository.deleteById(applicationId);
    }

    @Override
    public List<ListenerApplicationResponseDTO> getAllApplications() {
        List<ListenerApplication> applications = listenerApplicationRepository.findAll();
        return applications.stream()
                .map(ListenerApplicationMapper::toResponseDTO)
                .toList();
    }

    @Override
    @Transactional
    public ListenerApplicationResponseDTO updateApplication(
            Integer applicationId, ListenerApplicationRequestDTO applicationRequestDTO, MultipartFile certificate) throws Exception {
        // Extract email and role from security context
        String email = getUsernameFromContext();
        String role = getRoleFromContext();

        // Find Listener Application by ID
        Optional<ListenerApplication> optionalApplication = listenerApplicationRepository.findById(applicationId);
        ListenerApplication listenerApplication = optionalApplication.orElseThrow(() ->
                new RuntimeException("Listener Application not found for ID: " + applicationId));

        // Check if the email matches or if the role is admin
        if (!listenerApplication.getUser().getEmail().equals(email) && !"ROLE_ADMIN".equals(role)) {
            throw new RuntimeException("Access denied for updating Listener Application with ID: " + applicationId);
        }

        // Map DTO to Entity with User
        User user = listenerApplication.getUser();
        ListenerApplication updatedApplication = ListenerApplicationMapper.toEntity(applicationRequestDTO, user);

        // Handle Certificate Upload
        String certificateUrl = imageStorageService.uploadImage(certificate);
        updatedApplication.setCertificateUrl(certificateUrl);

        // Set additional fields
        updatedApplication.setApplicationId(applicationId); // Ensure the ID remains the same
        updatedApplication.setApplicationStatus(ListenerApplicationStatus.PENDING);
        updatedApplication.setSubmissionDate(LocalDateTime.now());

        // Save updated Listener Application
        ListenerApplication savedApplication = listenerApplicationRepository.save(updatedApplication);

        // Convert Entity to Response DTO
        return ListenerApplicationMapper.toResponseDTO(savedApplication);
    }

    private String getUsernameFromContext() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return (principal instanceof UserDetails) ? ((UserDetails) principal).getUsername() : principal.toString();
    }

    private String getRoleFromContext() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return (principal instanceof UserDetails) ? ((UserDetails) principal).getAuthorities().stream()
                .map(GrantedAuthority::getAuthority)
                .findFirst()
                .orElse("ROLE_USER") : "ROLE_USER";
    }
}
