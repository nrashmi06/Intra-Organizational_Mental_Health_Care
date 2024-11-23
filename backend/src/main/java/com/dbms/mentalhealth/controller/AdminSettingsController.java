package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.adminSettings.request.AdminSettingsRequestDTO;
import com.dbms.mentalhealth.dto.adminSettings.response.AdminSettingsResponseDTO;
import com.dbms.mentalhealth.service.AdminSettingsService;
import com.dbms.mentalhealth.urlMapper.AdminSettingsUrlMapping;
import org.springframework.beans.factory.annotation.Autowired;
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
        AdminSettingsResponseDTO responseDTO = adminSettingsService.createAdminSettings(adminSettingsRequestDTO);
        return ResponseEntity.ok(responseDTO);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping(AdminSettingsUrlMapping.UPDATE_ADMIN_SETTINGS)
    public ResponseEntity<AdminSettingsResponseDTO> updateAdminSettings(@RequestBody AdminSettingsRequestDTO adminSettingsRequestDTO) {
        AdminSettingsResponseDTO responseDTO = adminSettingsService.updateAdminSettings(adminSettingsRequestDTO);
        return ResponseEntity.ok(responseDTO);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping(AdminSettingsUrlMapping.DELETE_ADMIN_SETTINGS)
    public ResponseEntity<String> deleteAdminSettings() {
        adminSettingsService.deleteAdminSettings();
        return ResponseEntity.ok("Admin settings deleted successfully");
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(AdminSettingsUrlMapping.GET_ADMIN_SETTINGS)
    public ResponseEntity<AdminSettingsResponseDTO> getAdminSettings() {
        AdminSettingsResponseDTO responseDTO = adminSettingsService.getAdminSettings();
        return ResponseEntity.ok(responseDTO);
    }
}