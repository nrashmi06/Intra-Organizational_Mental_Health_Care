package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.dto.EmergencyHelpline.EmergencyHelplineDTO;

import java.util.List;

public interface EmergencyHelplineService {
    List<EmergencyHelplineDTO> getAllEmergencyHelplines();
    EmergencyHelplineDTO addEmergencyHelpline(EmergencyHelplineDTO emergencyHelplineDTO);
    EmergencyHelplineDTO updateEmergencyHelpline(Integer helplineId, EmergencyHelplineDTO emergencyHelplineDTO);
    void deleteEmergencyHelpline(Integer helplineId);
}