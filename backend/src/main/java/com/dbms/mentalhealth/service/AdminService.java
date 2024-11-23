package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.dto.Admin.request.AdminProfileRequestDTO;
import com.dbms.mentalhealth.dto.Admin.response.AdminProfileResponseDTO;
import com.dbms.mentalhealth.dto.Admin.response.AdminProfileSummaryResponseDTO;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

public interface AdminService {
    AdminProfileResponseDTO createAdminProfile(AdminProfileRequestDTO adminProfileRequestDTO, MultipartFile profilePicture) throws Exception;
    AdminProfileResponseDTO getAdminProfile(Integer adminId);
    AdminProfileResponseDTO updateAdminProfile(Integer adminId, AdminProfileRequestDTO adminProfileRequestDTO, MultipartFile profilePicture) throws Exception;
    List<AdminProfileSummaryResponseDTO> getAllAdmins();
    String deleteAdminProfile(Integer adminId);
}