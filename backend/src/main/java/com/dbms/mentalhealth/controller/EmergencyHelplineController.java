package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.EmergencyHelpline.EmergencyHelplineDTO;
import com.dbms.mentalhealth.exception.emergency.EmergencyHelplineNotFoundException;
import com.dbms.mentalhealth.exception.emergency.InvalidEmergencyHelplineException;
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

    @PreAuthorize("permitAll()")
    @GetMapping(EmergencyHelplineUrlMapping.GET_ALL_EMERGENCY_HELPLINES)
    public List<EmergencyHelplineDTO> getAllEmergencyHelplines() {
        return emergencyHelplineService.getAllEmergencyHelplines();
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping(EmergencyHelplineUrlMapping.ADD_EMERGENCY_HELPLINE)
    @ResponseStatus(HttpStatus.CREATED)
    public EmergencyHelplineDTO addEmergencyHelpline(@RequestBody EmergencyHelplineDTO emergencyHelplineDTO) {
        try {
            return emergencyHelplineService.addEmergencyHelpline(emergencyHelplineDTO);
        } catch (InvalidEmergencyHelplineException e) {
            throw new InvalidEmergencyHelplineException("Invalid emergency helpline data");
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping(EmergencyHelplineUrlMapping.UPDATE_EMERGENCY_HELPLINE)
    public EmergencyHelplineDTO updateEmergencyHelpline(@PathVariable Integer helplineId, @RequestBody EmergencyHelplineDTO emergencyHelplineDTO) {
        try {
            return emergencyHelplineService.updateEmergencyHelpline(helplineId, emergencyHelplineDTO);
        } catch (EmergencyHelplineNotFoundException e) {
            throw new EmergencyHelplineNotFoundException("Emergency helpline not found with ID: " + helplineId);
        } catch (InvalidEmergencyHelplineException e) {
            throw new InvalidEmergencyHelplineException("Invalid emergency helpline data");
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @DeleteMapping(EmergencyHelplineUrlMapping.DELETE_EMERGENCY_HELPLINE)
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteEmergencyHelpline(@PathVariable Integer helplineId) {
        try {
            emergencyHelplineService.deleteEmergencyHelpline(helplineId);
        } catch (EmergencyHelplineNotFoundException e) {
            throw new EmergencyHelplineNotFoundException("Emergency helpline not found with ID: " + helplineId);
        }
    }
}