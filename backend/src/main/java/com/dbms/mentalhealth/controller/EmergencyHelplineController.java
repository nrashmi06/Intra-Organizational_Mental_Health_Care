package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.EmergencyHelpline.EmergencyHelplineDTO;
import com.dbms.mentalhealth.mapper.EmergencyHelplineMapper;
import com.dbms.mentalhealth.service.EmergencyHelplineService;
import com.dbms.mentalhealth.urlMapper.EmergencyHelplineUrlMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;

@RestController
public class EmergencyHelplineController {

    private final EmergencyHelplineService emergencyHelplineService;
    private final EmergencyHelplineMapper emergencyHelplineMapper;

    @Autowired
    public EmergencyHelplineController(EmergencyHelplineService emergencyHelplineService, EmergencyHelplineMapper emergencyHelplineMapper) {
        this.emergencyHelplineService = emergencyHelplineService;
        this.emergencyHelplineMapper = emergencyHelplineMapper;
    }

    @GetMapping(EmergencyHelplineUrlMapping.GET_ALL_EMERGENCY_HELPLINES)
    public List<EmergencyHelplineDTO> getAllEmergencyHelplines() {
        return emergencyHelplineService.getAllEmergencyHelplines().stream()
                .map(emergencyHelplineMapper::toDTO)
                .collect(Collectors.toList());
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(EmergencyHelplineUrlMapping.ADD_EMERGENCY_HELPLINE)
    @ResponseStatus(HttpStatus.CREATED)
    public EmergencyHelplineDTO addEmergencyHelpline(@RequestBody EmergencyHelplineDTO emergencyHelplineDTO) {
        return emergencyHelplineMapper.toDTO(
                emergencyHelplineService.addEmergencyHelpline(
                        emergencyHelplineMapper.toEntity(emergencyHelplineDTO)
                )
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(EmergencyHelplineUrlMapping.UPDATE_EMERGENCY_HELPLINE)
    public EmergencyHelplineDTO updateEmergencyHelpline(@PathVariable Integer helplineId, @RequestBody EmergencyHelplineDTO emergencyHelplineDTO) {
        return emergencyHelplineMapper.toDTO(
                emergencyHelplineService.updateEmergencyHelpline(
                        helplineId, emergencyHelplineMapper.toEntity(emergencyHelplineDTO)
                )
        );
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping(EmergencyHelplineUrlMapping.DELETE_EMERGENCY_HELPLINE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEmergencyHelpline(@PathVariable Integer helplineId) {
        emergencyHelplineService.deleteEmergencyHelpline(helplineId);
    }
}