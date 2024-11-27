package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.adminSettings.request.AdminSettingsRequestDTO;
import com.dbms.mentalhealth.dto.adminSettings.response.AdminSettingsResponseDTO;
import com.dbms.mentalhealth.exception.adminSettings.AdminSettingsNotFoundException;
import com.dbms.mentalhealth.exception.adminSettings.InvalidAdminSettingsException;
import com.dbms.mentalhealth.service.AdminSettingsService;
import com.dbms.mentalhealth.urlMapper.AdminSettingsUrlMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@RestController
public class AdminSettingsController {

    @Autowired
    private AdminSettingsService adminSettingsService;

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping(AdminSettingsUrlMapping.CREATE_ADMIN_SETTINGS)
    public ResponseEntity<AdminSettingsResponseDTO> createAdminSettings(@RequestBody AdminSettingsRequestDTO adminSettingsRequestDTO) {
        try {
            AdminSettingsResponseDTO responseDTO = adminSettingsService.createAdminSettings(adminSettingsRequestDTO);
            return ResponseEntity.ok(responseDTO);
        } catch (InvalidAdminSettingsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping(AdminSettingsUrlMapping.UPDATE_ADMIN_SETTINGS)
    public ResponseEntity<AdminSettingsResponseDTO> updateAdminSettings(@RequestBody AdminSettingsRequestDTO adminSettingsRequestDTO) {
        try {
            AdminSettingsResponseDTO responseDTO = adminSettingsService.updateAdminSettings(adminSettingsRequestDTO);
            return ResponseEntity.ok(responseDTO);
        } catch (AdminSettingsNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (InvalidAdminSettingsException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping(AdminSettingsUrlMapping.DELETE_ADMIN_SETTINGS)
    public ResponseEntity<String> deleteAdminSettings() {
        try {
            adminSettingsService.deleteAdminSettings();
            return ResponseEntity.ok("Admin settings deleted successfully");
        } catch (AdminSettingsNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(e.getMessage());
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(AdminSettingsUrlMapping.GET_ADMIN_SETTINGS)
    public ResponseEntity<AdminSettingsResponseDTO> getAdminSettings() {
        try {
            AdminSettingsResponseDTO responseDTO = adminSettingsService.getAdminSettings();
            return ResponseEntity.ok(responseDTO);
        } catch (AdminSettingsNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
}