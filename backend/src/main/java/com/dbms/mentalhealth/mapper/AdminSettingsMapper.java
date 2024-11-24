package com.dbms.mentalhealth.mapper;

import com.dbms.mentalhealth.dto.adminSettings.request.AdminSettingsRequestDTO;
import com.dbms.mentalhealth.dto.adminSettings.response.AdminSettingsResponseDTO;
import com.dbms.mentalhealth.model.AdminSettings;
import org.springframework.stereotype.Component;

@Component
public class AdminSettingsMapper {

    public AdminSettingsResponseDTO toResponseDTO(AdminSettings adminSettings) {
        if (adminSettings == null) {
            return null;
        }

        AdminSettingsResponseDTO responseDTO = new AdminSettingsResponseDTO();
        responseDTO.setSettingId(adminSettings.getSettingId());
        responseDTO.setAdminId(adminSettings.getAdmin().getAdminId());
        responseDTO.setIsCounsellor(adminSettings.getIsCounsellor());
        responseDTO.setMaxAppointmentsPerDay(adminSettings.getMaxAppointmentsPerDay());
        responseDTO.setDefaultTimeSlotDuration(adminSettings.getDefaultTimeSlotDuration());
        responseDTO.setCreatedAt(adminSettings.getCreatedAt());
        responseDTO.setUpdatedAt(adminSettings.getUpdatedAt());

        return responseDTO;
    }

    public AdminSettings toEntity(AdminSettingsRequestDTO adminSettingsRequestDTO) {
        if (adminSettingsRequestDTO == null) {
            return null;
        }

        AdminSettings adminSettings = new AdminSettings();
        adminSettings.setIsCounsellor(adminSettingsRequestDTO.getIsCounsellor());
        adminSettings.setMaxAppointmentsPerDay(adminSettingsRequestDTO.getMaxAppointmentsPerDay());
        adminSettings.setDefaultTimeSlotDuration(adminSettingsRequestDTO.getDefaultTimeSlotDuration());

        return adminSettings;
    }
}