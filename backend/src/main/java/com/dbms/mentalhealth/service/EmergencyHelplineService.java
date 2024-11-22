package com.dbms.mentalhealth.service;

import com.dbms.mentalhealth.model.EmergencyHelpline;

import java.util.List;

public interface EmergencyHelplineService {
    List<EmergencyHelpline> getAllEmergencyHelplines();
    EmergencyHelpline addEmergencyHelpline(EmergencyHelpline emergencyHelpline);
    EmergencyHelpline updateEmergencyHelpline(Integer helplineId, EmergencyHelpline emergencyHelpline);
    void deleteEmergencyHelpline(Integer helplineId);
}