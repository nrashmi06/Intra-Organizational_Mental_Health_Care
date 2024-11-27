package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.Admin.request.AdminProfileRequestDTO;
import com.dbms.mentalhealth.dto.Admin.response.AdminProfileResponseDTO;
import com.dbms.mentalhealth.dto.Admin.response.AdminProfileSummaryResponseDTO;
import com.dbms.mentalhealth.exception.admin.AdminNotFoundException;
import com.dbms.mentalhealth.service.AdminService;
import com.dbms.mentalhealth.urlMapper.AdminUrlMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
public class AdminController {

    private final AdminService adminService;

    @Autowired
    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(AdminUrlMapping.CREATE_ADMIN_PROFILE)
    public ResponseEntity<AdminProfileResponseDTO> createAdminProfile(
            @RequestPart("adminProfile") AdminProfileRequestDTO adminProfileRequestDTO,
            @RequestPart("profilePicture") MultipartFile profilePicture) throws Exception {
        try {
            AdminProfileResponseDTO responseDTO = adminService.createAdminProfile(adminProfileRequestDTO, profilePicture);
            return ResponseEntity.ok(responseDTO);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(AdminUrlMapping.GET_ADMIN_PROFILE)
    public ResponseEntity<AdminProfileResponseDTO> getAdminProfile(@PathVariable Integer adminId) {
        try {
            AdminProfileResponseDTO responseDTO = adminService.getAdminProfile(adminId);
            return ResponseEntity.ok(responseDTO);
        } catch (AdminNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(AdminUrlMapping.UPDATE_ADMIN_PROFILE)
    public ResponseEntity<AdminProfileResponseDTO> updateAdminProfile(
            @PathVariable Integer adminId,
            @RequestPart("adminProfile") AdminProfileRequestDTO adminProfileRequestDTO,
            @RequestPart("profilePicture") MultipartFile profilePicture) throws Exception {
        try {
            AdminProfileResponseDTO responseDTO = adminService.updateAdminProfile(adminId, adminProfileRequestDTO, profilePicture);
            return ResponseEntity.ok(responseDTO);
        } catch (AdminNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @GetMapping(AdminUrlMapping.GET_ALL_ADMINS)
    public ResponseEntity<List<AdminProfileSummaryResponseDTO>> getAllAdmins() {
        List<AdminProfileSummaryResponseDTO> responseDTO = adminService.getAllAdmins();
        return ResponseEntity.ok(responseDTO);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping(AdminUrlMapping.DELETE_ADMIN_PROFILE)
    public ResponseEntity<String> deleteAdminProfile(@PathVariable Integer adminId) {
        try {
            adminService.deleteAdminProfile(adminId);
            return ResponseEntity.ok("Admin profile deleted successfully");
        } catch (AdminNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Admin not found");
        }
    }
}