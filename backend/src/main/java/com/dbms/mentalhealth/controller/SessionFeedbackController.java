package com.dbms.mentalhealth.controller;

import com.dbms.mentalhealth.dto.sessionFeedback.request.SessionFeedbackRequestDTO;
import com.dbms.mentalhealth.dto.sessionFeedback.response.SessionFeedbackResponseDTO;
import com.dbms.mentalhealth.dto.sessionFeedback.response.SessionFeedbackSummaryResponseDTO;
import com.dbms.mentalhealth.service.SessionFeedbackService;
import com.dbms.mentalhealth.urlMapper.SessionFeedbackUrlMapping;
import com.dbms.mentalhealth.util.Etags.SessionFeedbackETagGenerator;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Objects;

@RestController
public class SessionFeedbackController {

    private final SessionFeedbackService sessionFeedbackService;
    private final SessionFeedbackETagGenerator eTagGenerator;

    public SessionFeedbackController(SessionFeedbackService sessionFeedbackService,
                                     SessionFeedbackETagGenerator eTagGenerator) {
        this.sessionFeedbackService = Objects.requireNonNull(sessionFeedbackService,
                "sessionFeedbackService cannot be null");
        this.eTagGenerator = Objects.requireNonNull(eTagGenerator,
                "eTagGenerator cannot be null");
    }

    @PreAuthorize("hasRole('ROLE_USER')")
    @PostMapping(SessionFeedbackUrlMapping.CREATE_FEEDBACK)
    public ResponseEntity<SessionFeedbackResponseDTO> createFeedback(
            @RequestBody SessionFeedbackRequestDTO requestDTO) {
        if (requestDTO == null) {
            return ResponseEntity.badRequest().build();
        }

        SessionFeedbackResponseDTO responseDTO = sessionFeedbackService.createFeedback(requestDTO);
        String eTag = eTagGenerator.generateFeedbackETag(responseDTO);

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(responseDTO);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(SessionFeedbackUrlMapping.GET_FEEDBACK_BY_SESSION_ID)
    public ResponseEntity<List<SessionFeedbackResponseDTO>> getFeedbackBySessionId(
            @PathVariable Integer sessionId,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch) {
        if (sessionId == null) {
            return ResponseEntity.badRequest().build();
        }

        List<SessionFeedbackResponseDTO> feedbackList = sessionFeedbackService.getFeedbackBySessionId(sessionId);
        if (feedbackList == null || feedbackList.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        String eTag = eTagGenerator.generateListETag(feedbackList);
        if (ifNoneMatch != null && !ifNoneMatch.trim().isEmpty() && eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .header(HttpHeaders.ETAG, eTag)
                    .build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(feedbackList);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(SessionFeedbackUrlMapping.GET_FEEDBACK_BY_ID)
    public ResponseEntity<SessionFeedbackResponseDTO> getFeedbackById(
            @PathVariable Integer feedbackId,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch) {
        if (feedbackId == null) {
            return ResponseEntity.badRequest().build();
        }

        SessionFeedbackResponseDTO responseDTO = sessionFeedbackService.getFeedbackById(feedbackId);
        String eTag = eTagGenerator.generateFeedbackETag(responseDTO);
        if (ifNoneMatch != null && !ifNoneMatch.trim().isEmpty() && eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .header(HttpHeaders.ETAG, eTag)
                    .build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(responseDTO);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(SessionFeedbackUrlMapping.GET_ALL_LISTENER_FEEDBACK)
    public ResponseEntity<List<SessionFeedbackResponseDTO>> getAllListenerFeedback(
            @PathVariable Integer id,
            @RequestParam("type") String type,
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch) {
        if (id == null || type == null || type.trim().isEmpty()) {
            return ResponseEntity.badRequest().build();
        }

        List<SessionFeedbackResponseDTO> feedbackList = sessionFeedbackService.getAllListenerFeedback(id, type);
        if (feedbackList == null || feedbackList.isEmpty()) {
            return ResponseEntity.noContent().build();
        }

        String eTag = eTagGenerator.generateListETag(feedbackList);
        if (ifNoneMatch != null && !ifNoneMatch.trim().isEmpty() && eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .header(HttpHeaders.ETAG, eTag)
                    .build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(feedbackList);
    }

    @PreAuthorize("hasRole('ROLE_ADMIN')")
    @GetMapping(SessionFeedbackUrlMapping.GET_ALL_FEEDBACK_SUMMARY)
    public ResponseEntity<SessionFeedbackSummaryResponseDTO> getFeedbackSummary(
            @RequestHeader(value = HttpHeaders.IF_NONE_MATCH, required = false) String ifNoneMatch) {

        SessionFeedbackSummaryResponseDTO summaryDTO = sessionFeedbackService.getFeedbackSummary();
        if (summaryDTO == null) {
            return ResponseEntity.noContent().build();
        }

        String eTag = eTagGenerator.generateSummaryETag(summaryDTO);
        if (ifNoneMatch != null && !ifNoneMatch.trim().isEmpty() && eTag.equals(ifNoneMatch)) {
            return ResponseEntity.status(HttpStatus.NOT_MODIFIED)
                    .header(HttpHeaders.ETAG, eTag)
                    .build();
        }

        return ResponseEntity.ok()
                .header(HttpHeaders.ETAG, eTag)
                .body(summaryDTO);
    }
}