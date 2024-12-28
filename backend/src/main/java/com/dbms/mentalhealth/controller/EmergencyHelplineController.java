package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.EmergencyHelpline.EmergencyHelplineDTO;
import com.dbms.mentalhealth.exception.emergency.EmergencyHelplineNotFoundException;
import com.dbms.mentalhealth.exception.emergency.InvalidEmergencyHelplineException;
import com.dbms.mentalhealth.service.EmergencyHelplineService;
import com.dbms.mentalhealth.urlMapper.EmergencyHelplineUrlMapping;
import com.dbms.mentalhealth.util.Etags.EmergencyHelplineETagGenerator;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
public class EmergencyHelplineController {

    private final EmergencyHelplineService emergencyHelplineService;
    private final EmergencyHelplineETagGenerator eTagGenerator;

    @Autowired
    public EmergencyHelplineController(EmergencyHelplineService emergencyHelplineService, EmergencyHelplineETagGenerator eTagGenerator) {
        this.emergencyHelplineService = emergencyHelplineService;
        this.eTagGenerator = eTagGenerator;
    }

    @PreAuthorize("permitAll()")
    @GetMapping(EmergencyHelplineUrlMapping.GET_ALL_EMERGENCY_HELPLINES)
    public ResponseEntity<List<EmergencyHelplineDTO>> getAllEmergencyHelplines(@RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch) {
        List<EmergencyHelplineDTO> helplines = emergencyHelplineService.getAllEmergencyHelplines();
        String eTag = eTagGenerator.generateHelplineETag(helplines);

        if (ifNoneMatch != null && !ifNoneMatch.trim().isEmpty() && eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED).build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(helplines);
    }


    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PostMapping(EmergencyHelplineUrlMapping.ADD_EMERGENCY_HELPLINE)
    @ResponseStatus(HttpStatus.CREATED)
    public ResponseEntity<EmergencyHelplineDTO> addEmergencyHelpline(@RequestBody EmergencyHelplineDTO emergencyHelplineDTO) {
        try {
            EmergencyHelplineDTO response = emergencyHelplineService.addEmergencyHelpline(emergencyHelplineDTO);
            String eTag = eTagGenerator.generateHelplineETag(response);
            return ResponseEntity.status(HttpStatus.CREATED)
                    .header(HttpHeaders.ETAG, eTag)
                    .body(response);
        } catch (InvalidEmergencyHelplineException e) {
            throw new InvalidEmergencyHelplineException("Invalid emergency helpline data");
        }
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping(EmergencyHelplineUrlMapping.UPDATE_EMERGENCY_HELPLINE)
    public ResponseEntity<EmergencyHelplineDTO> updateEmergencyHelpline(@PathVariable Integer helplineId, @RequestBody EmergencyHelplineDTO emergencyHelplineDTO) {
        try {
            EmergencyHelplineDTO response = emergencyHelplineService.updateEmergencyHelpline(helplineId, emergencyHelplineDTO);
            String eTag = eTagGenerator.generateHelplineETag(response);
            return ResponseEntity.ok()
                    .header(HttpHeaders.ETAG, eTag)
                    .body(response);
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