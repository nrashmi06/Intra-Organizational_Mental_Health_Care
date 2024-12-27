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

    @PreAuthorize("hasRole('ROLE_ADMIN')")
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

    @PreAuthorize("isAuthenticated()")
    @GetMapping(AdminUrlMapping.GET_ADMIN_PROFILE)
    public ResponseEntity<AdminProfileResponseDTO> getAdminProfile(
            @RequestParam(value = "userId", required = false) Integer userId,
            @RequestParam(value = "adminId", required = false) Integer adminId) {
        AdminProfileResponseDTO adminProfile = adminService.getAdminProfile(userId, adminId);
        return ResponseEntity.ok(adminProfile);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping(AdminUrlMapping.UPDATE_ADMIN_PROFILE)
    public ResponseEntity<AdminProfileResponseDTO> updateAdminProfile(
            @RequestPart("adminProfile") AdminProfileRequestDTO adminProfileRequestDTO,
            @RequestPart(value = "profilePicture", required = false) MultipartFile profilePicture) throws Exception {
        try {
            AdminProfileResponseDTO responseDTO = adminService.updateAdminProfile(adminProfileRequestDTO, profilePicture);
            return ResponseEntity.ok(responseDTO);
        } catch (AdminNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
        }
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping(AdminUrlMapping.GET_ALL_ADMINS)
    public ResponseEntity<List<AdminProfileSummaryResponseDTO>> getAllAdmins() {
        List<AdminProfileSummaryResponseDTO> responseDTO = adminService.getAllAdmins();
        return ResponseEntity.ok(responseDTO);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
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