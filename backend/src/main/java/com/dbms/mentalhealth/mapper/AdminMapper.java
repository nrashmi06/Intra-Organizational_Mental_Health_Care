package com.dbms.mentalhealth.mapper;

import com.dbms.mentalhealth.dto.Admin.request.AdminProfileRequestDTO;
import com.dbms.mentalhealth.dto.Admin.response.AdminProfileResponseDTO;
import com.dbms.mentalhealth.dto.Admin.response.AdminProfileSummaryResponseDTO;
import com.dbms.mentalhealth.model.Admin;
import com.dbms.mentalhealth.model.User;
import org.springframework.stereotype.Component;

@Component
public class AdminMapper {

    public Admin toEntity(AdminProfileRequestDTO adminProfileRequestDTO, User user,String profilePictureUrl) {
        Admin admin = new Admin();
        admin.setUser(user);
        admin.setAdminNotes(adminProfileRequestDTO.getAdminNotes());
        admin.setQualifications(adminProfileRequestDTO.getQualifications());
        admin.setContactNumber(adminProfileRequestDTO.getContactNumber());
        admin.setProfilePictureUrl(profilePictureUrl); // Set profile picture URL
        admin.setEmail(adminProfileRequestDTO.getEmail());
        admin.setFullName(adminProfileRequestDTO.getFullName());
        return admin;
    }

    public AdminProfileResponseDTO toResponseDTO(Admin admin) {
        AdminProfileResponseDTO responseDTO = new AdminProfileResponseDTO();
        responseDTO.setAdminId(admin.getAdminId());
        responseDTO.setUserId(admin.getUser().getUserId());
        responseDTO.setAdminNotes(admin.getAdminNotes());
        responseDTO.setQualifications(admin.getQualifications());
        responseDTO.setContactNumber(admin.getContactNumber());
        responseDTO.setEmail(admin.getEmail());
        responseDTO.setProfilePictureUrl(admin.getProfilePictureUrl()); // Set profile picture URL
        responseDTO.setCreatedAt(admin.getCreatedAt());
        responseDTO.setFullName(admin.getFullName());
        responseDTO.setUpdatedAt(admin.getUpdatedAt());
        return responseDTO;
    }

    public AdminProfileSummaryResponseDTO toSummaryResponseDTO(Admin admin) {
        AdminProfileSummaryResponseDTO summaryDTO = new AdminProfileSummaryResponseDTO();
        summaryDTO.setAdminId(admin.getAdminId());
        summaryDTO.setFullName(admin.getFullName());
        summaryDTO.setAdminNotes(admin.getAdminNotes());
        summaryDTO.setContactNumber(admin.getContactNumber());
        return summaryDTO;
    }
}