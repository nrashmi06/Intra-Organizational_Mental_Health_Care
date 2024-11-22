package com.dbms.mentalhealth.mapper;

import com.dbms.mentalhealth.dto.EmergencyHelpline.EmergencyHelplineDTO;
import com.dbms.mentalhealth.model.EmergencyHelpline;
import org.springframework.stereotype.Component;

@Component
public class EmergencyHelplineMapper {

    public EmergencyHelplineDTO toDTO(EmergencyHelpline emergencyHelpline) {
        EmergencyHelplineDTO dto = new EmergencyHelplineDTO();
        dto.setHelplineId(emergencyHelpline.getHelplineId());
        dto.setName(emergencyHelpline.getName());
        dto.setPhoneNumber(emergencyHelpline.getPhoneNumber());
        dto.setCountryCode(emergencyHelpline.getCountryCode());
        dto.setEmergencyType(emergencyHelpline.getEmergencyType());
        dto.setPriority(emergencyHelpline.getPriority());
        return dto;
    }

    public EmergencyHelpline toEntity(EmergencyHelplineDTO dto) {
        EmergencyHelpline emergencyHelpline = new EmergencyHelpline();
        emergencyHelpline.setHelplineId(dto.getHelplineId());
        emergencyHelpline.setName(dto.getName());
        emergencyHelpline.setPhoneNumber(dto.getPhoneNumber());
        emergencyHelpline.setCountryCode(dto.getCountryCode());
        emergencyHelpline.setEmergencyType(dto.getEmergencyType());
        emergencyHelpline.setPriority(dto.getPriority());
        return emergencyHelpline;
    }
}