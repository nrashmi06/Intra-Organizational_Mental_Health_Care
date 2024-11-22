package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.Listener.response.ListenerDetailsResponseDTO;
import com.dbms.mentalhealth.dto.listenerApplication.request.ListenerApplicationRequestDTO;
import com.dbms.mentalhealth.dto.listenerApplication.request.UpdateApplicationStatusRequestDTO;
import com.dbms.mentalhealth.dto.listenerApplication.response.ListenerApplicationResponseDTO;
import com.dbms.mentalhealth.enums.ListenerApplicationStatus;
import com.dbms.mentalhealth.service.ListenerApplicationService;
import com.dbms.mentalhealth.urlMapper.ListenerApplicationUrlMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;


@RestController
public class ListenerApplicationController {

    @Autowired
    private ListenerApplicationService listenerApplicationService;

    @PostMapping(value = ListenerApplicationUrlMapping.SUBMIT_APPLICATION,consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ListenerApplicationResponseDTO> submitApplication(
            @RequestPart("application") ListenerApplicationRequestDTO applicationRequestDTO,
            @RequestPart("certificate") MultipartFile certificate) throws Exception {
        ListenerApplicationResponseDTO responseDTO = listenerApplicationService.submitApplication(applicationRequestDTO, certificate);
        return ResponseEntity.ok(responseDTO);
    }

    @GetMapping(ListenerApplicationUrlMapping.GET_APPLICATION_BY_ID)
    public ResponseEntity<ListenerApplicationResponseDTO> getApplicationById(@PathVariable("applicationId") Integer applicationId) {
        ListenerApplicationResponseDTO responseDTO = listenerApplicationService.getApplicationById(applicationId);
        return ResponseEntity.ok(responseDTO);
    }


    @DeleteMapping(ListenerApplicationUrlMapping.DELETE_APPLICATION)
    public void deleteApplication(@PathVariable("applicationId") Integer applicationId) {
        listenerApplicationService.deleteApplication(applicationId);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping(ListenerApplicationUrlMapping.GET_ALL_APPLICATIONS)
    public ResponseEntity<List<ListenerApplicationResponseDTO>> getAllApplications() {
        List<ListenerApplicationResponseDTO> responseDTO = listenerApplicationService.getAllApplications();
        return ResponseEntity.ok(responseDTO);
    }

    @PutMapping(value = ListenerApplicationUrlMapping.UPDATE_APPLICATION,consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ListenerApplicationResponseDTO> updateApplication(
            @PathVariable("applicationId") Integer applicationId,
            @RequestPart("application") ListenerApplicationRequestDTO applicationRequestDTO,
            @RequestPart("certificate") MultipartFile certificate) throws Exception {
        ListenerApplicationResponseDTO responseDTO = listenerApplicationService.updateApplication(applicationId, applicationRequestDTO, certificate);
        return ResponseEntity.ok(responseDTO);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(ListenerApplicationUrlMapping.UPDATE_APPLICATION_STATUS)
    public ResponseEntity<ListenerDetailsResponseDTO> updateApplicationStatus(
            @PathVariable("applicationId") Integer applicationId,
            @RequestBody UpdateApplicationStatusRequestDTO status) {
        ListenerDetailsResponseDTO responseDTO = listenerApplicationService.updateApplicationStatus(applicationId, status.getStatus());
        return ResponseEntity.ok(responseDTO);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping(ListenerApplicationUrlMapping.GET_APPLICATION_BY_APPROVAL_STATUS)
    public ResponseEntity<List<ListenerApplicationResponseDTO>> getApplicationByApprovalStatus(
            @RequestParam("status") String status) {
        List<ListenerApplicationResponseDTO> responseDTO = listenerApplicationService.getApplicationByApprovalStatus(status);
        return ResponseEntity.ok(responseDTO);
    }
}