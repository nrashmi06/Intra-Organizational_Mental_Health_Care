package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.EmergencyHelpline.EmergencyHelplineDTO;
import com.dbms.mentalhealth.service.EmergencyHelplineService;
import com.dbms.mentalhealth.urlMapper.EmergencyHelplineUrlMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class EmergencyHelplineController {

    private final EmergencyHelplineService emergencyHelplineService;

    @Autowired
    public EmergencyHelplineController(EmergencyHelplineService emergencyHelplineService) {
        this.emergencyHelplineService = emergencyHelplineService;
    }

    @GetMapping(EmergencyHelplineUrlMapping.GET_ALL_EMERGENCY_HELPLINES)
    public List<EmergencyHelplineDTO> getAllEmergencyHelplines() {
        return emergencyHelplineService.getAllEmergencyHelplines();
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PostMapping(EmergencyHelplineUrlMapping.ADD_EMERGENCY_HELPLINE)
    @ResponseStatus(HttpStatus.CREATED)
    public EmergencyHelplineDTO addEmergencyHelpline(@RequestBody EmergencyHelplineDTO emergencyHelplineDTO) {
        return emergencyHelplineService.addEmergencyHelpline(emergencyHelplineDTO);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(EmergencyHelplineUrlMapping.UPDATE_EMERGENCY_HELPLINE)
    public EmergencyHelplineDTO updateEmergencyHelpline(@PathVariable Integer helplineId, @RequestBody EmergencyHelplineDTO emergencyHelplineDTO) {
        return emergencyHelplineService.updateEmergencyHelpline(helplineId, emergencyHelplineDTO);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @DeleteMapping(EmergencyHelplineUrlMapping.DELETE_EMERGENCY_HELPLINE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEmergencyHelpline(@PathVariable Integer helplineId) {
        emergencyHelplineService.deleteEmergencyHelpline(helplineId);
    }
}