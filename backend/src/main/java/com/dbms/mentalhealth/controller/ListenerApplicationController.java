package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.listenerApplication.response.ListenerApplicationSummaryResponseDTO;
import com.dbms.mentalhealth.dto.Listener.response.ListenerDetailsResponseDTO;
import com.dbms.mentalhealth.dto.listenerApplication.request.ListenerApplicationRequestDTO;
import com.dbms.mentalhealth.dto.listenerApplication.response.ListenerApplicationResponseDTO;
import com.dbms.mentalhealth.service.ListenerApplicationService;
import com.dbms.mentalhealth.urlMapper.ListenerApplicationUrlMapping;
import com.dbms.mentalhealth.util.Etags.ListenerApplicationETagGenerator;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Objects;

@RestController
public class ListenerApplicationController {

    private final ListenerApplicationService listenerApplicationService;
    private final ListenerApplicationETagGenerator eTagGenerator;

    public ListenerApplicationController(ListenerApplicationService listenerApplicationService,
                                         ListenerApplicationETagGenerator eTagGenerator) {
        this.listenerApplicationService = Objects.requireNonNull(listenerApplicationService, "listenerApplicationService cannot be null");
        this.eTagGenerator = Objects.requireNonNull(eTagGenerator, "eTagGenerator cannot be null");
    }

    @PreAuthorize("isAuthenticated()")
    @PostMapping(value = ListenerApplicationUrlMapping.SUBMIT_APPLICATION, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ListenerApplicationResponseDTO> submitApplication(
            @RequestPart("application") ListenerApplicationRequestDTO applicationRequestDTO,
            @RequestPart("certificate") MultipartFile certificate) throws Exception {
        ListenerApplicationResponseDTO responseDTO = listenerApplicationService.submitApplication(applicationRequestDTO, certificate);
        String eTag = eTagGenerator.generateApplicationETag(responseDTO);
        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(responseDTO);
    }

    @PreAuthorize("isAuthenticated()")
    @GetMapping(ListenerApplicationUrlMapping.GET_APPLICATION_BY_ID)
    public ResponseEntity<ListenerApplicationResponseDTO> getApplicationById(
            @RequestParam(value = "applicationId", required = false) Integer applicationId,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch) {
        ListenerApplicationResponseDTO responseDTO = listenerApplicationService.getApplicationById(applicationId);
        String eTag = eTagGenerator.generateApplicationETag(responseDTO);

        if (ifNoneMatch != null && !ifNoneMatch.trim().isEmpty() && eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .header(HttpHeaders.ETAG, eTag)
                    .build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(responseDTO);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_LISTENER')")
    @DeleteMapping(ListenerApplicationUrlMapping.DELETE_APPLICATION)
    public ResponseEntity<Void> deleteApplication(@PathVariable("applicationId") Integer applicationId) {
        listenerApplicationService.deleteApplication(applicationId);
        return ResponseEntity.noContent().build();
    }

    @PreAuthorize("isAuthenticated()")
    @PutMapping(value = ListenerApplicationUrlMapping.UPDATE_APPLICATION, consumes = MediaType.MULTIPART_FORM_DATA_VALUE)
    public ResponseEntity<ListenerApplicationResponseDTO> updateApplication(
            @PathVariable("applicationId") Integer applicationId,
            @RequestPart("application") ListenerApplicationRequestDTO applicationRequestDTO,
            @RequestPart(value = "certificate", required = false) MultipartFile certificate) throws Exception {
        ListenerApplicationResponseDTO responseDTO = listenerApplicationService.updateApplication(applicationId, applicationRequestDTO, certificate);
        String eTag = eTagGenerator.generateApplicationETag(responseDTO);
        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(responseDTO);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @PutMapping(ListenerApplicationUrlMapping.UPDATE_APPLICATION_STATUS)
    public ResponseEntity<ListenerDetailsResponseDTO> updateApplicationStatus(
            @PathVariable("applicationId") Integer applicationId,
            @RequestParam(value = "status", required = false) String status) {
        ListenerDetailsResponseDTO responseDTO = listenerApplicationService.updateApplicationStatus(applicationId, status);
        return ResponseEntity.ok(responseDTO);
    }

    @PreAuthorize("hasAnyRole('ROLE_ADMIN','ROLE_LISTENER')")
    @GetMapping(ListenerApplicationUrlMapping.GET_APPLICATION_BY_LISTENERS_USER_ID)
    public ResponseEntity<ListenerApplicationResponseDTO> getApplicationsByListenersUserId(
            @PathVariable Integer userId,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch) {
        ListenerApplicationResponseDTO application = listenerApplicationService.getApplicationsByUserId(userId);

        if (application == null) {
            return ResponseEntity.noContent().build();
        }

        String eTag = eTagGenerator.generateApplicationETag(application);

        if (ifNoneMatch != null && !ifNoneMatch.trim().isEmpty() && eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .header(HttpHeaders.ETAG, eTag)
                    .build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(application);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(ListenerApplicationUrlMapping.GET_APPLICATIONS)
    public ResponseEntity<Page<ListenerApplicationSummaryResponseDTO>> getApplications(
            @RequestParam(value = "status", required = false) String status,
            @PageableDefault(size = 10, sort = "applicationId", direction = Sort.Direction.DESC) Pageable pageable,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch) {

        Page<ListenerApplicationSummaryResponseDTO> responseDTO = listenerApplicationService.getApplications(status, pageable);

        String eTag = eTagGenerator.generatePageETag(responseDTO);

        if (ifNoneMatch != null && !ifNoneMatch.trim().isEmpty() && eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .header(HttpHeaders.ETAG, eTag)
                    .build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(responseDTO);
    }
}