package com.dbms.mentalhealth.service.impl;

import com.dbms.mentalhealth.dto.EmergencyHelpline.EmergencyHelplineDTO;
import com.dbms.mentalhealth.exception.admin.AdminNotFoundException;
import com.dbms.mentalhealth.exception.emergency.EmergencyHelplineNotFoundException;
import com.dbms.mentalhealth.mapper.EmergencyHelplineMapper;
import com.dbms.mentalhealth.model.Admin;
import com.dbms.mentalhealth.model.EmergencyHelpline;
import com.dbms.mentalhealth.repository.AdminRepository;
import com.dbms.mentalhealth.repository.EmergencyHelplineRepository;
import com.dbms.mentalhealth.security.jwt.JwtUtils;
import com.dbms.mentalhealth.service.EmergencyHelplineService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.annotation.Lazy;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EmergencyHelplineServiceImpl implements EmergencyHelplineService {

    private final EmergencyHelplineRepository emergencyHelplineRepository;
    private final AdminRepository adminRepository;
    private final EmergencyHelplineMapper emergencyHelplineMapper;
    private final JwtUtils jwtUtils;

    @Autowired
    public EmergencyHelplineServiceImpl(EmergencyHelplineRepository emergencyHelplineRepository, AdminRepository adminRepository, EmergencyHelplineMapper emergencyHelplineMapper, @Lazy JwtUtils jwtUtils) {
        this.emergencyHelplineRepository = emergencyHelplineRepository;
        this.adminRepository = adminRepository;
        this.emergencyHelplineMapper = emergencyHelplineMapper;
        this.jwtUtils = jwtUtils;
    }

    @Override
    public List<EmergencyHelplineDTO> getAllEmergencyHelplines() {
        return emergencyHelplineRepository.findAll().stream()
                .map(emergencyHelplineMapper::toDTO)
                .toList();
    }

    @Override
    public EmergencyHelplineDTO addEmergencyHelpline(EmergencyHelplineDTO emergencyHelplineDTO) {
        Integer userId = jwtUtils.getUserIdFromContext();
        Admin admin = adminRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new AdminNotFoundException("Admin not found with ID: " + userId));
        EmergencyHelpline emergencyHelpline = emergencyHelplineMapper.toEntity(emergencyHelplineDTO,admin);
        emergencyHelpline.setAdmin(admin);
        return emergencyHelplineMapper.toDTO(emergencyHelplineRepository.save(emergencyHelpline));
    }

    @Override
    public EmergencyHelplineDTO updateEmergencyHelpline(Integer helplineId, EmergencyHelplineDTO emergencyHelplineDTO) {
        Integer userId = jwtUtils.getUserIdFromContext();
        Admin admin = adminRepository.findByUser_UserId(userId)
                .orElseThrow(() -> new AdminNotFoundException("Admin not found with ID: " + userId));
        EmergencyHelpline existingHelpline = emergencyHelplineRepository.findById(helplineId)
                .orElseThrow(() -> new EmergencyHelplineNotFoundException("Emergency Helpline not found with ID: " + helplineId));
        existingHelpline.setName(emergencyHelplineDTO.getName());
        existingHelpline.setPhoneNumber(emergencyHelplineDTO.getPhoneNumber());
        existingHelpline.setCountryCode(emergencyHelplineDTO.getCountryCode());
        existingHelpline.setEmergencyType(emergencyHelplineDTO.getEmergencyType());
        existingHelpline.setPriority(emergencyHelplineDTO.getPriority());
        existingHelpline.setAdmin(admin);
        return emergencyHelplineMapper.toDTO(emergencyHelplineRepository.save(existingHelpline));
    }

    @Override
    public void deleteEmergencyHelpline(Integer helplineId) {
        emergencyHelplineRepository.deleteById(helplineId);
    }
}