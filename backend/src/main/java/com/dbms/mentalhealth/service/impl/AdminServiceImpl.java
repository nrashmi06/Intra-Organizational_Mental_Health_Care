package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.Admin.request.AdminProfileRequestDTO;
import com.dbms.mentalhealth.dto.Admin.response.AdminProfileResponseDTO;
import com.dbms.mentalhealth.dto.Admin.response.AdminProfileSummaryResponseDTO;
import com.dbms.mentalhealth.enums.Role;
import com.dbms.mentalhealth.exception.AdminNotFoundException;
import com.dbms.mentalhealth.mapper.AdminMapper;
import com.dbms.mentalhealth.model.Admin;
import com.dbms.mentalhealth.model.User;
import com.dbms.mentalhealth.repository.AdminRepository;
import com.dbms.mentalhealth.repository.UserRepository;
import com.dbms.mentalhealth.service.AdminService;
import com.dbms.mentalhealth.service.ImageStorageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class AdminServiceImpl implements AdminService {

    private final AdminRepository adminRepository;
    private final UserRepository userRepository;
    private final AdminMapper adminMapper;
    private final ImageStorageService imageStorageService;

    @Autowired
    public AdminServiceImpl(AdminRepository adminRepository, UserRepository userRepository, AdminMapper adminMapper, ImageStorageService imageStorageService) {
        this.adminRepository = adminRepository;
        this.userRepository = userRepository;
        this.adminMapper = adminMapper;
        this.imageStorageService = imageStorageService;
    }

    @Override
    public AdminProfileResponseDTO createAdminProfile(AdminProfileRequestDTO adminProfileRequestDTO, MultipartFile profilePicture) throws Exception {
        String email = getCurrentUserEmail();
        User user = userRepository.findByEmail(email);
        if (user == null) {
            throw new UsernameNotFoundException("User not found");
        }

        if (!user.getRole().equals(Role.ADMIN)) {
            throw new AdminNotFoundException("User is not authorized to create an admin profile");
        }

        Optional<Admin> existingAdmin = adminRepository.findByUser(user);
        if (existingAdmin.isPresent()) {
            throw new AdminNotFoundException("Admin profile already exists");
        }

        // Upload image and get URL
        String profilePictureUrl = imageStorageService.uploadImage(profilePicture);
        Admin admin = adminMapper.toEntity(adminProfileRequestDTO, user, profilePictureUrl);
        admin.setCreatedAt(LocalDateTime.now());
        admin.setUpdatedAt(LocalDateTime.now());

        Admin savedAdmin = adminRepository.save(admin);

        return adminMapper.toResponseDTO(savedAdmin);
    }

    @Override
    public AdminProfileResponseDTO getAdminProfile(Integer adminId) {
        Admin admin = adminRepository.findByAdminId(adminId)
                .orElseThrow(() -> new AdminNotFoundException("Admin profile not found"));

        return adminMapper.toResponseDTO(admin);
    }

    @Override
    public AdminProfileResponseDTO updateAdminProfile(Integer adminId, AdminProfileRequestDTO adminProfileRequestDTO, MultipartFile profilePicture) throws Exception {
        Admin admin = adminRepository.findByAdminId(adminId)
                .orElseThrow(() -> new AdminNotFoundException("Admin profile not found"));

        // Update image if provided
        String profilePictureUrl = profilePicture != null ? imageStorageService.uploadImage(profilePicture) : admin.getProfilePictureUrl();

        admin.setAdminNotes(adminProfileRequestDTO.getAdminNotes());
        admin.setQualifications(adminProfileRequestDTO.getQualifications());
        admin.setFullName(adminProfileRequestDTO.getFullName());
        admin.setContactNumber(adminProfileRequestDTO.getContactNumber());
        admin.setEmail(adminProfileRequestDTO.getEmail());
        admin.setProfilePictureUrl(profilePictureUrl);
        admin.setUpdatedAt(LocalDateTime.now());

        Admin savedAdmin = adminRepository.save(admin);

        return adminMapper.toResponseDTO(savedAdmin);
    }

    @Override
    public String deleteAdminProfile(Integer adminId) {
        Admin admin = adminRepository.findByAdminId(adminId)
                .orElseThrow(() -> new AdminNotFoundException("Admin profile not found"));

        adminRepository.delete(admin);
        return "Admin profile deleted successfully";
    }


    @Override
    public List<AdminProfileSummaryResponseDTO> getAllAdmins() {
        List<Admin> admins = adminRepository.findAll();
        return admins.stream().map(adminMapper::toSummaryResponseDTO).toList();
    }
    private String getCurrentUserEmail() {
        Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        return (principal instanceof UserDetails) ? ((UserDetails) principal).getUsername() : principal.toString();
    }
}