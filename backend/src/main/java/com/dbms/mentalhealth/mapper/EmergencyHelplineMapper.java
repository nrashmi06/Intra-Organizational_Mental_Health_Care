package com.dbms.mentalhealth.mapper;

import com.dbms.mentalhealth.dto.EmergencyHelpline.EmergencyHelplineDTO;
import com.dbms.mentalhealth.model.Admin;
import com.dbms.mentalhealth.model.EmergencyHelpline;
import com.dbms.mentalhealth.repository.AdminRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class EmergencyHelplineMapper {

    @Autowired
    private AdminRepository adminRepository;

    public EmergencyHelplineDTO toDTO(EmergencyHelpline emergencyHelpline) {
        EmergencyHelplineDTO dto = new EmergencyHelplineDTO();
        dto.setHelplineId(emergencyHelpline.getHelplineId());
        dto.setName(emergencyHelpline.getName());
        dto.setPhoneNumber(emergencyHelpline.getPhoneNumber());
        dto.setCountryCode(emergencyHelpline.getCountryCode());
        dto.setEmergencyType(emergencyHelpline.getEmergencyType());
        dto.setPriority(emergencyHelpline.getPriority());
        dto.setAdminId(emergencyHelpline.getAdmin().getAdminId());
        return dto;
    }

    public EmergencyHelpline toEntity(EmergencyHelplineDTO dto, Admin admin) {
        EmergencyHelpline emergencyHelpline = new EmergencyHelpline();
        emergencyHelpline.setHelplineId(dto.getHelplineId());
        emergencyHelpline.setName(dto.getName());
        emergencyHelpline.setPhoneNumber(dto.getPhoneNumber());
        emergencyHelpline.setCountryCode(dto.getCountryCode());
        emergencyHelpline.setEmergencyType(dto.getEmergencyType());
        emergencyHelpline.setPriority(dto.getPriority());
        emergencyHelpline.setAdmin(admin);
        return emergencyHelpline;
    }
}