package com.dbms.mentalhealth.controller;
import com.dbms.mentalhealth.dto.listenerApplication.response.ListenerApplicationSummaryResponseDTO;
import com.dbms.mentalhealth.dto.Listener.response.ListenerDetailsResponseDTO;
import com.dbms.mentalhealth.dto.listenerApplication.request.ListenerApplicationRequestDTO;
import com.dbms.mentalhealth.dto.listenerApplication.response.ListenerApplicationResponseDTO;
import com.dbms.mentalhealth.exception.listener.ListenerApplicationNotFoundException;
import com.dbms.mentalhealth.exception.listener.InvalidListenerApplicationException;
import com.dbms.mentalhealth.service.ListenerApplicationService;
import com.dbms.mentalhealth.urlMapper.ListenerApplicationUrlMapping;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
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

    @PostMapping(value = ListenerApplicationUrlMapping.SUBMIT_APPLICATION, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ListenerApplicationResponseDTO> submitApplication(
            @RequestPart("application") ListenerApplicationRequestDTO applicationRequestDTO,
            @RequestPart("certificate") MultipartFile certificate) throws Exception {
        try {
            ListenerApplicationResponseDTO responseDTO = listenerApplicationService.submitApplication(applicationRequestDTO, certificate);
            return ResponseEntity.ok(responseDTO);
        } catch (InvalidListenerApplicationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @GetMapping(ListenerApplicationUrlMapping.GET_APPLICATION_BY_ID)
    public ResponseEntity<ListenerApplicationResponseDTO> getApplicationById(@RequestParam(value = "applicationId",required = false) Integer applicationId) {
        try {
            ListenerApplicationResponseDTO responseDTO = listenerApplicationService.getApplicationById(applicationId);
            return ResponseEntity.ok(responseDTO);
        } catch (ListenerApplicationNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }


    @DeleteMapping(ListenerApplicationUrlMapping.DELETE_APPLICATION)
    public ResponseEntity<Void> deleteApplication(@PathVariable("applicationId") Integer applicationId) {
        try {
            listenerApplicationService.deleteApplication(applicationId);
            return ResponseEntity.noContent().build();
        } catch (ListenerApplicationNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping(ListenerApplicationUrlMapping.GET_ALL_APPLICATIONS)
    public ResponseEntity<List<ListenerApplicationSummaryResponseDTO>> getAllApplications() {
        List<ListenerApplicationSummaryResponseDTO> responseDTO = listenerApplicationService.getAllApplications();
        return ResponseEntity.ok(responseDTO);
    }

    @PutMapping(value = ListenerApplicationUrlMapping.UPDATE_APPLICATION, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ListenerApplicationResponseDTO> updateApplication(
            @PathVariable("applicationId") Integer applicationId,
            @RequestPart("application") ListenerApplicationRequestDTO applicationRequestDTO,
            @RequestPart(value = "certificate",required = false) MultipartFile certificate) throws Exception {
        try {
            ListenerApplicationResponseDTO responseDTO = listenerApplicationService.updateApplication(applicationId, applicationRequestDTO, certificate);
            return ResponseEntity.ok(responseDTO);
        } catch (ListenerApplicationNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        } catch (InvalidListenerApplicationException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(null);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @PutMapping(ListenerApplicationUrlMapping.UPDATE_APPLICATION_STATUS)
    public ResponseEntity<ListenerDetailsResponseDTO> updateApplicationStatus(
            @PathVariable("applicationId") Integer applicationId,
            @RequestParam(value = "status", required = false) String status) {
        try {
            ListenerDetailsResponseDTO responseDTO = listenerApplicationService.updateApplicationStatus(applicationId,status);
            return ResponseEntity.ok(responseDTO);
        } catch (ListenerApplicationNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping(ListenerApplicationUrlMapping.GET_APPLICATION_BY_APPROVAL_STATUS)
    public ResponseEntity<List<ListenerApplicationSummaryResponseDTO>> getApplicationByApprovalStatus(
            @RequestParam("status") String status) {
        List<ListenerApplicationSummaryResponseDTO> responseDTO = listenerApplicationService.getApplicationByApprovalStatus(status);
        return ResponseEntity.ok(responseDTO);
    }

    @PreAuthorize("hasRole('ADMIN')")
    @GetMapping(ListenerApplicationUrlMapping.GET_APPLICATION_BY_LISTENERS_USER_ID)
    public ResponseEntity<ListenerApplicationResponseDTO> getApplicationsByListenersUserId(@PathVariable Integer userId) {
        ListenerApplicationResponseDTO applications = listenerApplicationService.getApplicationsByUserId(userId);
        return ResponseEntity.ok(applications);
    }
}