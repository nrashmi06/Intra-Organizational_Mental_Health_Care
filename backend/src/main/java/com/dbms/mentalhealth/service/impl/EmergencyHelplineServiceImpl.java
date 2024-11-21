package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.model.EmergencyHelpline;
import com.dbms.mentalhealth.repository.EmergencyHelplineRepository;
import com.dbms.mentalhealth.service.EmergencyHelplineService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmergencyHelplineServiceImpl implements EmergencyHelplineService {

    private final EmergencyHelplineRepository emergencyHelplineRepository;

    @Autowired
    public EmergencyHelplineServiceImpl(EmergencyHelplineRepository emergencyHelplineRepository) {
        this.emergencyHelplineRepository = emergencyHelplineRepository;
    }

    @Override
    public List<EmergencyHelpline> getAllEmergencyHelplines() {
        return emergencyHelplineRepository.findAll();
    }

    @Override
    public EmergencyHelpline addEmergencyHelpline(EmergencyHelpline emergencyHelpline) {
        return emergencyHelplineRepository.save(emergencyHelpline);
    }

    @Override
    public EmergencyHelpline updateEmergencyHelpline(Integer helplineId, EmergencyHelpline emergencyHelpline) {
        EmergencyHelpline existingHelpline = emergencyHelplineRepository.findById(helplineId)
                .orElseThrow(() -> new EntityNotFoundException("Emergency Helpline not found with ID: " + helplineId));
        existingHelpline.setName(emergencyHelpline.getName());
        existingHelpline.setPhoneNumber(emergencyHelpline.getPhoneNumber());
        existingHelpline.setCountryCode(emergencyHelpline.getCountryCode());
        existingHelpline.setEmergencyType(emergencyHelpline.getEmergencyType());
        existingHelpline.setPriority(emergencyHelpline.getPriority());
        return emergencyHelplineRepository.save(existingHelpline);
    }

    @Override
    public void deleteEmergencyHelpline(Integer helplineId) {
        emergencyHelplineRepository.deleteById(helplineId);
    }

}