package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.dto.adminSettings.request.AdminSettingsRequestDTO;
import com.dbms.mentalhealth.dto.adminSettings.response.AdminSettingsResponseDTO;

public interface AdminSettingsService {
    AdminSettingsResponseDTO createAdminSettings(AdminSettingsRequestDTO adminSettingsRequestDTO);
    AdminSettingsResponseDTO updateAdminSettings(AdminSettingsRequestDTO adminSettingsRequestDTO);
    void deleteAdminSettings();
    AdminSettingsResponseDTO getAdminSettings();
}