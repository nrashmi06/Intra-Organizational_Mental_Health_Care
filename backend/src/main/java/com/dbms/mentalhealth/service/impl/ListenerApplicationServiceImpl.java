package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.listenerApplication.request.UpdateApplicationStatusRequestDTO;
import com.dbms.mentalhealth.dto.listenerApplication.response.ListenerApplicationSummaryResponseDTO;
import com.dbms.mentalhealth.dto.Listener.response.ListenerDetailsResponseDTO;
import com.dbms.mentalhealth.dto.listenerApplication.request.ListenerApplicationRequestDTO;
import com.dbms.mentalhealth.dto.listenerApplication.response.ListenerApplicationResponseDTO;
import com.dbms.mentalhealth.enums.ListenerApplicationStatus;
import com.dbms.mentalhealth.enums.Role;
import com.dbms.mentalhealth.exception.listener.AccessDeniedException;
import com.dbms.mentalhealth.exception.listener.ApplicationAlreadySubmittedException;
import com.dbms.mentalhealth.exception.listener.ListenerApplicationNotFoundException;
import com.dbms.mentalhealth.exception.listener.ListenerNotFoundException;
import com.dbms.mentalhealth.exception.user.UserNotFoundException;
import com.dbms.mentalhealth.mapper.ListenerApplicationMapper;
import com.dbms.mentalhealth.mapper.ListenerDetailsMapper;
import com.dbms.mentalhealth.model.Listener;
import com.dbms.mentalhealth.model.ListenerApplication;
import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.repository.ListenerApplicationRepository;
import com.dbms.mentalhealth.repository.ListenerRepository;
import com.dbms.mentalhealth.repository.UserRepository;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
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

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;


@Service
public class ListenerApplicationServiceImpl implements ListenerApplicationService {

    private final ListenerApplicationRepository listenerApplicationRepository;
    private final ImageStorageService imageStorageService;
    private final UserRepository userRepository;
    private final ListenerRepository listenerRepository;
    private final JwtUtils jwtUtils;

    @Autowired
    public ListenerApplicationServiceImpl(
            ListenerApplicationRepository listenerApplicationRepository,
            ImageStorageService imageStorageService,
            UserService userService,
            UserRepository userRepository,
            ListenerRepository listenerRepository, JwtUtils jwtUtils) {
        this.listenerApplicationRepository = listenerApplicationRepository;
        this.imageStorageService = imageStorageService;
        this.userRepository = userRepository;
        this.listenerRepository = listenerRepository;
        this.jwtUtils = jwtUtils;
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
        // Extract user ID and role from security context
        Integer userId = jwtUtils.getUserIdFromContext();
        String role = getRoleFromContext();

        ListenerApplication listenerApplication;

        // If applicationId is null, find the application by user ID
        if (applicationId == null) {
            listenerApplication = listenerApplicationRepository.findByUser_UserId(userId)
                    .orElseThrow(() -> new ListenerApplicationNotFoundException(
                            "Listener Application not found for user ID: " + userId));
        } else {
            listenerApplication = listenerApplicationRepository.findById(applicationId)
                    .orElseThrow(() -> new ListenerApplicationNotFoundException(
                            "Listener Application not found for ID: " + applicationId));
        }

        // Check if the user has access to the application
        if (!listenerApplication.getUser().getUserId().equals(userId) && !"ROLE_ADMIN".equals(role)) {
            throw new ListenerApplicationNotFoundException(
                    "Access denied for Listener Application ID: " + listenerApplication.getApplicationId());
        }

        // Map and return the Listener Application DTO
        return ListenerApplicationMapper.toResponseDTO(listenerApplication);
    }




    @Override
    public void deleteApplication(Integer applicationId) {
        // Extract user ID and role from security context
        Integer userId = jwtUtils.getUserIdFromContext();
        String role = getRoleFromContext();

        ListenerApplication listenerApplication;

        // Find Listener Application by ID
        listenerApplication = listenerApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new ListenerApplicationNotFoundException(
                        "Listener Application not found for ID: " + applicationId));

        // Check if the user has access to delete the application
        if (!listenerApplication.getUser().getUserId().equals(userId) && !"ROLE_ADMIN".equals(role)) {
            throw new AccessDeniedException("Access denied for deleting Listener Application with ID: " + applicationId);
        }

        // Delete the Listener Application
        listenerApplicationRepository.deleteById(applicationId);
    }

    @Override
    public List<ListenerApplicationSummaryResponseDTO> getAllApplications() {
        List<ListenerApplication> applications = listenerApplicationRepository.findAll();
        return applications.stream()
                .map(ListenerApplicationMapper::toSummaryResponseDTO)
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
                new ListenerApplicationNotFoundException("Listener Application not found for ID: " + applicationId));

        // Check if the email matches or if the role is admin
        if (!listenerApplication.getUser().getEmail().equals(email) && !"ROLE_ADMIN".equals(role)) {
            throw new AccessDeniedException("Access denied for updating Listener Application with ID: " + applicationId);
        }

        // Map DTO to Entity with User
        User user = listenerApplication.getUser();
        ListenerApplication updatedApplication = ListenerApplicationMapper.toEntity(applicationRequestDTO, user);

        // Handle Certificate Upload if present
        if (certificate != null && !certificate.isEmpty()) {
            // Delete current image if exists
            if (listenerApplication.getCertificateUrl() != null) {
                imageStorageService.deleteImage(listenerApplication.getCertificateUrl());
            }
            // Upload new image
            String certificateUrl = imageStorageService.uploadImage(certificate);
            updatedApplication.setCertificateUrl(certificateUrl);
        } else {
            // Retain the current certificate URL
            updatedApplication.setCertificateUrl(listenerApplication.getCertificateUrl());
        }

        // Set additional fields
        updatedApplication.setApplicationId(applicationId); // Ensure the ID remains the same
        updatedApplication.setSubmissionDate(LocalDateTime.now());
        updatedApplication.setApplicationStatus(listenerApplication.getApplicationStatus());
        // Save updated Listener Application
        ListenerApplication savedApplication = listenerApplicationRepository.save(updatedApplication);

        // Convert Entity to Response DTO
        return ListenerApplicationMapper.toResponseDTO(savedApplication);
    }

    @Override
    @Transactional
    public ListenerDetailsResponseDTO updateApplicationStatus(Integer applicationId, String status) {
        // Fetch the ListenerApplication entity
        ListenerApplication listenerApplication = listenerApplicationRepository.findById(applicationId)
                .orElseThrow(() -> new RuntimeException("Listener Application not found for ID: " + applicationId));

        // Get the applicant user from the ListenerApplication entity
        User applicantUser = listenerApplication.getUser();
        if (applicantUser == null) {
            throw new UserNotFoundException("User associated with Listener Application not found");
        }

        // Update the application status
        if ("APPROVED".equalsIgnoreCase(status)) {
            listenerApplication.setApplicationStatus(ListenerApplicationStatus.APPROVED);

            // Check if a Listener entity already exists for the user
            boolean listenerExists = listenerRepository.existsByUser(applicantUser);

            if (!listenerExists) {
                // Create and save a new Listener entity for the approved user
                applicantUser.setRole(Role.LISTENER);
                userRepository.save(applicantUser);
                Listener newListener = new Listener();
                newListener.setUser(applicantUser); // Set the user associated with the application
                newListener.setCanApproveBlogs(false); // Default value
                newListener.setTotalSessions(0); // Default value
                newListener.setAverageRating(BigDecimal.ZERO); // Default value
                newListener.setJoinedAt(LocalDateTime.now());
                newListener.setApprovedBy(userRepository.findByEmail(getUsernameFromContext()).getAnonymousName());

                // Save the Listener entity
                listenerRepository.save(newListener);

                // Save the updated ListenerApplication entity
                listenerApplicationRepository.save(listenerApplication);

                // Convert and return the ListenerDetailsResponseDTO using the mapper
                return ListenerDetailsMapper.toResponseDTO(newListener);
            } else {
                // Save the updated ListenerApplication entity
                listenerApplicationRepository.save(listenerApplication);

                // Return the existing ListenerDetailsResponseDTO
                Listener existingListener = listenerRepository.findByUser(applicantUser)
                        .orElseThrow(() -> new ListenerNotFoundException("Listener not found for user: " + applicantUser.getEmail()));
                return ListenerDetailsMapper.toResponseDTO(existingListener);
            }

        } else if ("REJECTED".equalsIgnoreCase(status)) {
            listenerApplication.setApplicationStatus(ListenerApplicationStatus.REJECTED);
            listenerApplicationRepository.save(listenerApplication);
            return null;
        } else {
            throw new IllegalArgumentException("Invalid status: " + status);
        }
    }


    @Override
    public List<ListenerApplicationSummaryResponseDTO> getApplicationByApprovalStatus(String status) {
        try {
            ListenerApplicationStatus applicationStatus = ListenerApplicationStatus.valueOf(status.toUpperCase());
            List<ListenerApplication> applications = listenerApplicationRepository.findByApplicationStatus(applicationStatus);
            return applications.stream()
                    .map(ListenerApplicationMapper::toSummaryResponseDTO)
                    .toList();
        } catch (IllegalArgumentException e) {
            throw new IllegalArgumentException("Invalid status: " + status, e);
        } catch (Exception e) {
            throw new RuntimeException("An error occurred while fetching applications by approval status", e);
        }
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
